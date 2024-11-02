import styled from "@emotion/styled";

interface IPage {
  currentPage: number;
  pageNum: number;
}

export const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const Button = styled.button`
  padding: 8px 12px;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  background-color: transparent;
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #3b82f6;
    color: white;
  }

  &:disabled {
    background-color: #e2e8f0;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

export const PageNum = styled.button<IPage>`
  padding: 8px 12px;
  border: 1px solid
    ${(props) => (props.currentPage === props.pageNum ? "#3b82f6" : "#d1d5db")};
  border-radius: 4px;
  background-color: ${(props) =>
    props.currentPage === props.pageNum ? "#3b82f6" : "white"};
  color: ${(props) =>
    props.currentPage === props.pageNum ? "white" : "#4b5563"};
  font-weight: ${(props) =>
    props.currentPage === props.pageNum ? "600" : "400"};
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #3b82f6;
    color: white;
  }
`;
