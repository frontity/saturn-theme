/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import Link from '../Link';
import Image from '../../../shared/components/Image';
import { home } from '../../../shared/contexts';

const Logo = ({ title, logoUrl, context }) => {
  const widths = [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000];
  const sizes = widths
    .map(width => `(max-width: ${width}px) ${width}px`)
    .join(', ');
  const srcset = widths
    .map(width => `${logoUrl}?scale.width=${width}px ${width}w`)
    .join(', ');

  return (
    <Container className="bar-logo">
      <Link
        type="latest"
        id="post"
        page={1}
        context={context}
        eventCategory="List bar"
        eventAction="go home"
      >
        <a>
          {logoUrl ? (
            <Image
              alt={title}
              height="100%"
              width="80%"
              src={logoUrl}
              sizes={sizes}
              srcSet={srcset}
              hasPlaceholder={false}
              lazyloadContainerSelector=".bar-logo"
              objectFit="contain"
            />
          ) : (
            <Title>{title}</Title>
          )}
        </a>
      </Link>
    </Container>
  );
};

Logo.propTypes = {
  title: PropTypes.string.isRequired,
  logoUrl: PropTypes.string.isRequired,
  context: PropTypes.shape({}).isRequired,
};

export default inject(({ stores: { settings } }) => {
  const { menu } = settings.theme;

  return {
    title: settings.generalApp.title,
    logoUrl: settings.theme.logoUrl || '',
    context: home(menu),
  };
})(Logo);

const Container = styled.div`
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: normal;
  margin: 0;
  width: ${({ theme }) => `calc(100vw - (2 * ${theme.heights.bar}))`};
  height: 40px;

  a {
    height: 100%;
    width: 100%;
    text-decoration: none;
    white-space: nowrap;
    font-size: ${({ theme }) => theme.logoFontSize};
    color: inherit !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Title = styled.span`
  height: 100%;
  overflow: hidden;
  font-size: inherit;
  display: flex;
  align-items: center;
`;
