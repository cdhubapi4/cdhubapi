import fetch from "@utils/fetch";
import axios from "axios";
import Link from "next/link";

const IndexPage = () => {
  const BASE_URL = `https://cdhubapi1.vercel.app/api`;
  return (
    <div>
      <h1>Hello Next.js 3👋</h1>
      <button onClick={() => axios.get(`${BASE_URL}/common/ping`)}>CHECK PING </button>
      <button onClick={() => axios.get(`${BASE_URL}/common/dbcheck`)}>CHECK DB Connection </button>
      <button onClick={() => axios.get(`${BASE_URL}/user?page=1&size=2`)}>GET USER </button>
      <p>
        <Link href="/about">About</Link>
      </p>
    </div>
  );
};

export default IndexPage;
