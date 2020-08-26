import React from "react"
import Header from "../components/header"
import { Link } from "gatsby"

export default function Home() {
  return (
    <div style={{ color: `purple` }}>
      <Header headerText="Hello World!!" />
      <Link to="/contact/">Contact</Link>
      <p>What a world.</p>
      <img src="https://source.unsplash.com/random/400x200" alt="" />

    </div>
  );
}