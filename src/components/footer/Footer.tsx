export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} EduLearn. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  