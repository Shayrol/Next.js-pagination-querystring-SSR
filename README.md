


## SSR 및 Pagination
![2024-11-0217-49-28-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/a1d3bfba-f4a2-49ef-9638-bf99b4e984bb)
<br>
> 페이지 이동마다 SSR 요청한 이유

우선 단점으로는 페이지 이동마다 SSR을 통해 전체 페이지가 새로 렌더링이 되어 느린 페이지 이동과 매번 서버에 새 요청을 보내야 하므로 <br>
불필요한 API 호출이 발생할 수 있어 성능 저하로 이어질 수 있습니다. <br><br>
하지만 SSR의 장점을 중요 시 하는 경우를 생각해 페이지 이동마다 SSR을 사용했습니다. <br>
블로그, 상품 목록, 상세 페이지 등 SEO에 중요한 페이지에 pagination 적용으로 검색 엔진에 각 페이지가 노출될 가능성이 높아지며, <br>
공유된 페이지가 og(Open Graph) 태그를 통해 제목, 내용, 이미지 등 요약된 정보를 미리 제공할 수 있다는 점이 있습니다.


## getServerSideProps() SSR 요청
```bash
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
```
router.query.page의 값을 통해 해당 게시물의 API 요청을 보내고 있습니다.
<br>

## router.push를 이용한 Pagination
```bash
import { useRouter } from "next/router";
import React from "react";
import * as S from "./pagination.styles";

interface IPaginationProps {
  pagination: {
    currentPage: number; // 현재 페이지 - (router.query.page의 값)
    totalPages: number; // 총 게시글 개수의 페이지 - (개시글 몇개씩 총 n개의 개시물을 계산)
  };
}

const Pagination01 = (props: IPaginationProps) => {
  const router = useRouter();
  const { currentPage, totalPages } = props.pagination;

  // 현재 페이지 그룹의 시작과 끝 계산
  // 보이는 페이지 배열 - (pageGroupSize에 따라 개수 정해짐)
  const pageGroupSize = 5;

  // 현재 그룹의 위치 계산 - (page=13인 경우 그룹(11~15사이)의 13 위치의 index)
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  // 그룹의 시작점 - (page=13인 경우 그룹 11부터 시작)
  const start = (currentGroup - 1) * pageGroupSize + 1;
  // 그룹의 마지막 + 배열 요소 마지막 번호 계산
  const end = Math.min(currentGroup * pageGroupSize, totalPages);

  // 페이지 번호 배열 생성 - {length: 5}, (_, i) => i + 1) ==> [1, 2, 3, 4, 5]
  const pageNumbers = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page.toString() },
    });
  };

  // 이전/다음 그룹으로 이동
  const handlePrevGroup = () => {
    const prevPage = Math.max(start - pageGroupSize, 1);
    handlePageChange(prevPage);
  };

  const handleNextGroup = () => {
    const nextPage = Math.min(end + 1, totalPages);
    handlePageChange(nextPage);
  };

  return (
    <S.Wrap>
      {/* 이전 그룹 버튼 */}
      {start > 1 && <S.Button onClick={handlePrevGroup}>이전</S.Button>}

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((pageNum) => (
        <S.PageNum
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          currentPage={currentPage}
          pageNum={pageNum}
        >
          {pageNum}
        </S.PageNum>
      ))}

      {/* 다음 그룹 버튼 */}
      {end < totalPages && <S.Button onClick={handleNextGroup}>다음</S.Button>}
    </S.Wrap>
  );
};

export default Pagination01;
```
props로 currentPage(현재router.query.page)와 totalPages(전체 게시물 개수)을 받아 구현
