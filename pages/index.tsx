import fetch from "@utils/fetch";
import Link from "next/link";

const IndexPage = () => {
  return (
    <div>
      <h1>Hello Next.js 2👋</h1>
      <button onClick={() => fetch("GET", "/user", { page: 1, size: 2 }).then(console.log)}>GET USER </button>
      <p>
        <Link href="/about">About</Link>
      </p>
    </div>
  );
};

export default IndexPage;
