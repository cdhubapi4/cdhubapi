import axios from "axios";
import Link from "next/link";

const IndexPage = () => {
  const BASE_URL = "http://220.70.31.85"
  return (
    <div>
      <h1>Hello Next.js 👋</h1>
      <button onClick={() => axios.get(`${BASE_URL}/api/user?page=1&size=10`).then((d)=>console.log(d.data))}>GET USER </button>
      <p>
        <Link href="/about">About</Link>
      </p>
    </div>
  );
}

export default IndexPage;
