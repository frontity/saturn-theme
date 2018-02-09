import styled from 'react-emotion';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: top;
`;

export const Title = styled.h1`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  margin-bottom: 10px;
  padding: 20px 15px;
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 1.8rem;
  line-height: 2.2rem;
  border-bottom: 1px solid #eee;
`;

export const Author = styled.a`
  font-weight: 300;
  padding: 5px 15px;
  color: ${({ theme }) => theme.colors.grey};
  margin: 0;
  font-size: 0.9rem;
  text-transform: uppercase;
`;

export const StyledDate = styled.p`
  font-weight: 300;
  margin: 0;
  padding: 5px 15px;
  color: ${({ theme }) => theme.colors.grey};
  font-size: 0.9rem;
  text-align: right;
`;
