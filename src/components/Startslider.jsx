import { useState } from "react";
import "./Startslider.css";

const slides = [
  {
    // eyebrow: "WINTERAUKTIONEN 2026",
    title: "Die Sammlung Wulf Herzogenrath",
    buttonText: "Zur Pressemitteilung",
    buttonLink: "/auktionen",
    artist: "GERHARD RICHTER",
    artwork: "„Kleine Teyde-Landschaft“. 1971",
    estimate: "EUR 800.000 – 1.200.000",
    image:
      "https://www.grisebach.com/img/containers/assets/highlights/2026-winter/sneak-preview/w26_sneak-preview_richter.png/1b0494b38282ca3f93ae23a457085bc6/w26_sneak-preview_richter.png",
  },
  {
    // eyebrow: "AKTUELLE AUKTIONEN",
    title: "Winterauktionen 2026",
    buttonText: "Zu den Auktionen",
    buttonLink: "/auktionen",
    artist: "AUKTIONSHAUS",
    artwork: "Ausgewählte Werke und Sammlungen",
    estimate: "",
    image:
      "https://www.grisebach.com/img/containers/assets/sommer2026.jpg/d4b7aec732178639d6bddbec5ba8539f/sommer2026.jpg",
  },
];

function Startslider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  function showSlide(index) {
    setActiveSlide((index + slides.length) % slides.length);
  }

  return (
    <section className="startslider" aria-label="Aktuelle Highlights">
      <div className="startslider__text">
        <div className="startslider__intro">
          {/* <p className="startslider__eyebrow">{slide.eyebrow}</p> */}

          <h1 className="startslider__title">{slide.title}</h1>

          <a className="startslider__button" href={slide.buttonLink}>
            {slide.buttonText}
          </a>
        </div>

        <div className="startslider__details">
          <p>{slide.artist}</p>
          <p>{slide.artwork}</p>

          {slide.estimate && (
            <p className="startslider__estimate">
              Schätzung:
              <br />
              {slide.estimate}
            </p>
          )}
        </div>
      </div>

      <div className="startslider__visual">
        <img
          className="startslider__image"
          src={slide.image}
          alt={`${slide.artist}: ${slide.artwork}`}
        />

        <div className="startslider__controls" aria-label="Slider-Steuerung">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={`startslider__dot ${
                index === activeSlide ? "is-active" : ""
              }`}
              aria-label={`Folie ${index + 1} anzeigen`}
              aria-pressed={index === activeSlide}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>

        <div className="startslider__arrows">
          <button
            type="button"
            aria-label="Vorherige Folie"
            onClick={() => showSlide(activeSlide - 1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Nächste Folie"
            onClick={() => showSlide(activeSlide + 1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

export default Startslider;