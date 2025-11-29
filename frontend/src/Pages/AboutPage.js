import React from "react";
import "./CssPages/AboutPage.css";

function AboutPage() {
  return (
    <div className="about-container">
      <h1>About EcoRoute</h1>
      <h2>Smarter Journeys for a Greener Future</h2>

      <div ClassName="seCtion-box">
        <p>
          EcoRoute was created by a team of passionate developers in Malaysia who
          recognized a major gap in today’s navigation systems. Traditional
          navigation apps focus only on speed—overlooking hidden fuel costs and
          the environmental impact of every trip. EcoRoute exists to fix that.
        </p>
      </div>

      <h2>Our Mission</h2>
      <div className="section-box">
        <p>
          Our mission is to empower commuters with transparent routing choices
          that balance time, fuel efficiency, and sustainability. We believe that
          the right information helps users make decisions that benefit both their
          wallet and the planet.
        </p>
      </div>

      <h2>What Makes EcoRoute Different</h2>
      <div className="section-box">
        <p>Every route is analyzed based on:</p>
        <ul>
          <li>Travel Time</li>
          <li>Distance</li>
          <li>Estimated Fuel Consumption</li>
          <li>Estimated CO₂ Emissions</li>
        </ul>
        <p>
          By combining real-time traffic data with your specific vehicle model,
          ECORoute helps you select the most efficient and eco-friendly path.
        </p>
      </div>

      <h2>Driving Sustainable Change</h2>
      <div className="section-box">
        <p>
          Every optimized trip contributes to reduced fuel waste, lower emissions,
          and cleaner air. Our goal is simple: to encourage small, meaningful
          changes in daily travel that collectively create a positive
          environmental impact.
        </p>
      </div>

      <h2>Meet the Team</h2>
      <div className="section-box">
        <p>
          We are <strong>Team KMPH</strong> — committed to building innovative,
          impactful, and sustainable mobility solutions for Southeast Asia.
          Thank you for choosing ECORoute.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
