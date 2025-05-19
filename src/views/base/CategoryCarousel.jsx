import React, { useState } from "react";

const CategoryCarousel = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState("Featured");

  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += 4) {
    chunkedCategories.push(categories.slice(i, i + 4));
  }

  return (
    <div id="category-carousel" className="carousel slide section-bg" data-bs-ride="false" data-bs-interval="false" style={{background: "#e5e7eb", padding: "15px", borderRadius: "5px"}}>
      <div className="carousel-inner text-center">

        {chunkedCategories.map((group, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {group.map((category, i) => (
                <button
                  key={i}
                  type="button"
                  className={`btn btn-lg px-5 ${activeCategory === category ? "btn-dark" : "btn-light"}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        ))}

      </div>

      {/* Carousel Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#category-carousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" style={{ filter: 'invert(100%) brightness(0)' }}></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#category-carousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" style={{ filter: 'invert(100%) brightness(0)' }}></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default CategoryCarousel;
