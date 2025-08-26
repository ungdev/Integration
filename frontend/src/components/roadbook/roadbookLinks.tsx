import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Link } from "react-router-dom";

export const RoadBookLinks = () => {

  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-full min-h-screen mx-auto">
      <Card className="w-full p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-3xl font-bold text-center">
          <span role="img" aria-label="rocket">📖</span>{" "}
          <span>Roadbook de l'intégration</span>{" "}
          <span role="img" aria-label="backpack">🚗</span>
        </h2>


        <div className="text-center text-gray-700 space-y-1">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae veritatis, ratione eaque exercitationem laborum nisi at, neque modi vel culpa nam corporis et alias reiciendis voluptatibus ullam. Sequi, iure vero! Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae fugit iusto illo. Laboriosam modi distinctio accusamus provident ipsum esse delectus voluptatum. Illum, ab distinctio. Ut deleniti at iste cupiditate consectetur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusamus illum dolor expedita sint deleniti sed, iure aperiam. Eligendi ipsam commodi dicta hic, modi mollitia molestias repellat quam repellendus fugit.</p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Link to={import.meta.env.VITE_ROADBOOK_URL_FRENCH}>
            <Button>
              <span role="img" aria-label="lien" className="mr-2">🔗</span>
              Accéder à la version Française
            </Button>
          </Link>
          {/* <Link to={import.meta.env.VITE_ROADBOOK_URL_ENGLISH}>
            <Button variant="link">
              English Version
            </Button>
          </Link> */}
          <p className="text-destructive">An english version will be available soon !</p>
        </div>
      </Card>
    </div>
  );
};

