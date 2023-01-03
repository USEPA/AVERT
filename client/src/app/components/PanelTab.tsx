/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import styled from '@emotion/styled';

const Tab = styled('li')<{ step: number }>`
  @media (min-width: 40em) {
    float: left;
    width: calc((100% - 2.5rem) * 0.333333);

    /* space between tabs */
    ${({ step }) => {
      if (step === 1 || step === 2) {
        return css`
          margin-right: 1.25rem;
        `;
      }
    }}

    /* right arrow */
    ${({ step }) => {
      if (step === 1 || step === 2) {
        return css`
          a::after {
            content: '';
            position: absolute;
            z-index: 1;
            top: 0;
            right: -1.25rem;
            /* css triangle */
            width: 0;
            height: 0;
            border-top: 1.25rem solid transparent;
            border-bottom: 1.25rem solid transparent;
            border-left: 1.25rem solid #f0f0f0; // base-lightest
          }
        `;
      }
    }}

    /* fill behind right arrow */
    ${({ step }) => {
      if (step === 2 || step === 3) {
        return css`
          a::before {
            content: '';
            position: absolute;
            top: 0;
            left: -1.25rem;
            width: 1.25rem;
            height: 100%;
            background-color: #f0f0f0; // base-lightest
          }
        `;
      }
    }}

    /* active tab – right arrow */
    a[data-active='true']::after {
      border-left-color: rgb(0, 128, 164);
    }

    /* active tab – fill behind right arrow */
    a[data-active='true']::before {
      background-color: rgb(0, 128, 164);
    }
  }
`;

const anchorStyles = css`
  &:hover,
  &:visited {
    color: #565c65; // base-dark
  }

  &[data-active='true'] {
    color: white;
    background-color: rgb(0, 128, 164);
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  }
`;

export function PanelTab(props: {
  step: number;
  active: boolean;
  title: string;
}) {
  const { step, active, title } = props;

  return (
    <Tab step={step}>
      <a
        css={anchorStyles}
        className={
          `position-relative display-block margin-top-1 padding-105 ` +
          `border-width-1px border-solid border-base-light ` +
          `text-no-underline text-center text-base-dark bg-base-lightest ` +
          `text-bold line-height-mono-1 cursor-default usa-js-no-click ` +
          `tablet:margin-top-0 tablet:border-0`
        }
        href="/"
        data-active={active}
        onClick={(ev) => ev.preventDefault()}
      >
        {title}
      </a>
    </Tab>
  );
}
