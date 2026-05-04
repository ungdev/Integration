import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import { MyNews } from "../components/news/newsSection";

const NewsPage = () => (
    <div>
        <Navbar />
        <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <MyNews />
            </div>
        </div>
        <Footer />
    </div>
);

export default NewsPage;
