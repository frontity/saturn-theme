/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import styled from 'react-emotion';

const Powered = () => (
  <Container>
    <Text>Mobile version powered by Frontity</Text>
  </Container>
);

export default Powered;

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 15px 20px;
  padding-top: 0;
  background-color: ${({ theme }) => theme.colors.altBackground};
  color: ${({ theme }) => theme.colors.altText};
`;

const Text = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
  width: 40vw;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
`;
