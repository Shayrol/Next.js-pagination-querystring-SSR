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
