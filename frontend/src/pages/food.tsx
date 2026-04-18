import { Navbar } from "../components/navbar";
import { FoodSection } from "../components/WEI_SDI_Food/foodSection"
import { Footer } from "../components/footer";


export const FoodPage = () => {

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <FoodSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}