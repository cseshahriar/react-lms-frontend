import React, { useState } from "react";

const CategoryCarousel = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.title || "Web & App Development"
  );

  const itemsPerSlide = 3;
  const chunkedCategories = [];

  for (let i = 0; i < categories.length; i += itemsPerSlide) {
    chunkedCategories.push(categories.slice(i, i + itemsPerSlide));
  }

  // Only show arrows if there are multiple slides
  const shouldShowArrows = chunkedCategories.length > 1;

  return (
    <div
      id="category-carousel"
      className="carousel slide section-bg"
      data-bs-ride="false"
      data-bs-interval="false"
      style={{ background: "#e5e7eb", padding: "15px", borderRadius: "5px" }}
    >
      <div className="carousel-inner text-center">
        {chunkedCategories.map((group, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {group.map((category, i) => (
                <button
                  key={i}
                  type="button"
                  className={`btn btn-lg px-5 ${
                    activeCategory === category.title ? "btn-dark" : "btn-light"
                  }`}
                  onClick={() => setActiveCategory(category.title)}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Conditionally render arrows */}
      {shouldShowArrows && (
        <>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#category-carousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              style={{ filter: "invert(100%) brightness(0)" }}
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#category-carousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              style={{ filter: "invert(100%) brightness(0)" }}
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}
    </div>
  );
};

export default CategoryCarousel;