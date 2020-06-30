/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled/macro';

type Props = {
  step: number;
  active: boolean;
  title: string;
};

type TabProps = {
  step: number;
};

const Tab = styled('li')<TabProps>`
  /* remove space above first tab */
  ${({ step }: TabProps) => {
    if (step === 1) {
      return css`
        a {
          margin-top: 0;
        }
      `;
    }
  }}

  @media (min-width: 35em) {
    float: left;
    width: calc((100% - 2.5rem) * 0.333333);

    /* space between tabs */
    ${({ step }: TabProps) => {
      if (step === 1 || step === 2) {
        return css`
          margin-right: 1.25rem;
        `;
      }
    }}

    /* right arrow */
    ${({ step }: TabProps) => {
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
            border-left: 1.25rem solid #ccc;
          }
        `;
      }
    }}

    /* fill behind right arrow */
    ${({ step }: TabProps) => {
      if (step === 2 || step === 3) {
        return css`
          a::before {
            content: '';
            position: absolute;
            top: 0;
            left: -1.25rem;
            width: 1.25rem;
            height: 2.5rem;
            background-color: #ccc;
          }
        `;
      }
    }}

    /* active tab – right arrow */
    a[data-active='true']::after {
      border-left-color: rgb(0, 190, 230);
    }

    /* active tab – fill behind right arrow */
    a[data-active='true']::before {
      background-color: rgb(0, 190, 230);
    }
  }
`;

const anchorStyles = css`
  display: block;
  margin-top: 0.375rem;
  padding: 0.75rem;
  border: 1px solid #aaa;
  line-height: 1;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  color: white;
  background-color: #ccc;
  cursor: default;

  &[data-active='true'] {
    background-color: rgb(0, 190, 230);
  }

  @media (min-width: 35em) {
    position: relative;
    margin-top: 0;
    border: 0;
  }
`;

function PanelTab({ step, active, title }: Props) {
  return (
    <Tab step={step}>
      <a
        css={anchorStyles}
        href="/"
        data-active={active}
        onClick={(ev) => ev.preventDefault()}
      >
        {title}
      </a>
    </Tab>
  );
}

export default PanelTab;
