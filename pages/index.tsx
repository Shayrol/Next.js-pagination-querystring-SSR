// // SSR로 전체 페이지가 리렌더링이 일어난다
// // 따라서 모듈화 해서 해당 컴포넌트만 리렌더링이 일어나게 즉 SPA처럼 부분 렌더링을 할 수 있다.
// // 또는 import { Suspense } from 'react'의 Suspense를 사용할 수 있다.

// import { useRouter } from "next/router";
// import Link from "next/link";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import Pagination01 from "@/src/components/pagination/01/pagination";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Meta {
  title: string;
  description: string;
}

interface IProps {
  data: Post[];
  pageMeta: Meta;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

function ServerSidePage({ data, pageMeta, pagination }: IProps) {
  // const router = useRouter();

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Head>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
      </Head>
      <div className="w-[1200px]">
        <div className="flex flex-col gap-3 mb-8">
          {data.map((el) => (
            <div
              key={el.id}
              className="w-full p-3 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            >
              <div className="text-xl pb-[2px] font-semibold">{el.title}</div>
              <p className="w-[900px] overflow-hidden whitespace-nowrap truncate">
                {el.body}
              </p>
              <div className="text-xs text-gray-400">userId: {el.userId}</div>
            </div>
          ))}
        </div>
        <Pagination01 pagination={pagination} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const page = Number(context.query.page) || 1;
  const limit = 5;
  const start = (page - 1) * limit;
  const totalCount = 100; // 전체 게시물 개수
  const totalPages = Math.ceil(totalCount / limit);

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`
  );
  const data = await res.json();

  return {
    props: {
      data,
      pageMeta: {
        title: `Page ${page} - SSR Test`,
        description: `Displaying page ${page} of posts`,
      },
      pagination: {
        currentPage: page,
        totalPages,
      },
    },
  };
}

export default ServerSidePage;

// 깃 등록
