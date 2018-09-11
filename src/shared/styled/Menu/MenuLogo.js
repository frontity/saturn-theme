import styled from 'styled-components';

export const Container = styled.div`
  box-sizing: border-box;
  width: calc(100% - ${({ theme }) => theme.heights.bar} - 20px);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InnerContainer = styled.div`
  width: 100%;
  height: 40px;
  margin: 0;
  text-decoration: none;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.logoFontSize};
  font-weight: normal;
  color: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: center;
  }
`;

export const Title = styled.span`
  height: 100%;
  line-height: 40px;
  font-size: inherit;
  overflow: hidden;
`;
