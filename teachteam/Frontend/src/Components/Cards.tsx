import Image from "next/image";
// Defining the props that our card component will accept
interface CardProps {
  title: string;
  description: string;
  imageSrc: string;
}

// reusable component
const Cards = ({ title, description, imageSrc }: CardProps) => {
  return (
    <div className="card">
      {/*Card image */}
      <Image src={imageSrc} alt={title} className="card-image" width={300} height={300} />
      {/* Text content: title and description */}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

export default Cards;
