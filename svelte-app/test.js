import fetch from "node-fetch";

async function test() {
  const res = await fetch("http://localhost:8080/api/hero-images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: "test2.jpg" })
  });
  console.log(await res.json());
}
test();
