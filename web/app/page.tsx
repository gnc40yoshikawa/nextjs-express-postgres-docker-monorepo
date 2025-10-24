export default async function Home() {
  const res = await fetch("http://api:4000/");
  const text = await res.text();

  return (
    <div>
      <h1>Message from Express.js API</h1>
      <p>{text}</p>
    </div>
  );
}