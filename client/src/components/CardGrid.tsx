import React from "react";
import CardItem from "./CardItem";

interface CardGridProps {
    cards: { title: string; description: string; image: string }[] ; }

    const CardGrid: React.FC<CardGridProps> = ({ cards }) => {
        return (
          <div className="card-grid">
            {cards.map((card, index) => (
              <CardItem key={index} {...card} />
            ))}
          </div>
        );
      };
      
      export default CardGrid;