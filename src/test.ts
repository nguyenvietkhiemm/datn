import { Project, SyntaxKind } from "ts-morph";
import fs from "fs";
import path from "path";

const project = new Project();
project.addSourceFilesAtPaths("src/**/*.{ts,tsx, js}"); // scan toàn bộ src

const plantumlLines: string[] = ["@startuml", "skinparam classAttributeIconSize 0"];

interface Relation {
  from: string;
  to: string;
}

// Mảng lưu các relationship
const relations: Relation[] = [];

// Duyệt các file
project.getSourceFiles().forEach(file => {
  // Classes
  file.getClasses().forEach(cls => {
    const className = cls.getName() || "Anonymous";
    plantumlLines.push(`class ${className} {`);

    cls.getProperties().forEach(prop => {
      plantumlLines.push(`  +${prop.getName()}: ${prop.getType().getText()}`);

      // Nếu property type là class/interface khác, tạo relation
      const typeName = prop.getType().getText().replace(/\[\]/, "");
      if (/^[A-Z]/.test(typeName) && typeName !== className) {
        relations.push({ from: className, to: typeName });
      }
    });

    cls.getMethods().forEach(method => {
      const params = method.getParameters()
        .map(p => `${p.getName()}: ${p.getType().getText()}`)
        .join(", ");
      const returnType = method.getReturnType().getText();
      plantumlLines.push(`  +${method.getName()}(${params}): ${returnType}`);

      // Nếu returnType là class/interface khác, tạo relation
      const returnTypeClean = returnType.replace(/\[\]/, "");
      if (/^[A-Z]/.test(returnTypeClean) && returnTypeClean !== className) {
        relations.push({ from: className, to: returnTypeClean });
      }
    });

    // extends
    cls.getExtends()?.getText() && relations.push({ from: className, to: cls.getExtends()!.getText() });
    // implements
    cls.getImplements().forEach(i => relations.push({ from: className, to: i.getText() }));

    plantumlLines.push("}");
  });

  // Interfaces
  file.getInterfaces().forEach(intf => {
    const interfaceName = intf.getName();
    plantumlLines.push(`interface ${interfaceName} {`);
    intf.getProperties().forEach(prop => {
      plantumlLines.push(`  +${prop.getName()}: ${prop.getType().getText()}`);

      const typeName = prop.getType().getText().replace(/\[\]/, "");
      if (/^[A-Z]/.test(typeName) && typeName !== interfaceName) {
        relations.push({ from: interfaceName, to: typeName });
      }
    });
    plantumlLines.push("}");
  });
});

// Thêm các relation (loại bỏ trùng)
[...new Map(relations.map(r => [`${r.from}->${r.to}`, r]))].forEach(([_, r]) => {
  plantumlLines.push(`${r.from} --> ${r.to}`);
});

plantumlLines.push("@enduml");

// Ghi file
const outputPath = path.join(__dirname, "../full-class-diagram.puml");
fs.writeFileSync(outputPath, plantumlLines.join("\n"));
console.log(`✅ Full PlantUML class diagram generated at ${outputPath}`);
