import styled from "styled-components";

export const Container = styled.header`
  width: 100%;
  
  position: absolute;
  top: 0;

  > :first-child {
    background: ${({ theme }) => theme.COLORS.WHITE};
    font-size: 0.8rem;

    width: 100%;
    height: 2rem;

    display: flex;
    align-items: center;
    justify-content: space-around;

    position: relative;

    ul {
      display: flex;
      gap: 1.5rem;
    }
  }

  > :nth-child(2) {
    background: ${({ theme }) => theme.COLORS.BLACK};

    width: 100%;
    height: 9rem;

    padding: 1.5rem;

    display: grid;
    grid-template-areas: "buttonMenu logo buttons" "input input input";
    align-items: center;
    justify-content: space-between;
    row-gap: 0.5rem;

    > img {
      grid-area: logo;
      width: 8rem;
      height: 3rem;
    }
  }

  .boxButtons {
    grid-area: buttons;
    height: 3rem;
    margin-right: 1rem;

    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1.1rem;

    > aside {
      display: none;
    }

    > button:not(:first-child) {
      width: 3.2rem;
      position: relative;

      span {
        background: ${({ theme }) => theme.COLORS.PURPLE};

        width: 1.6rem;
        height: 1.6rem;

        border-radius: 50%;

        position: absolute;
        right: -1px;
        top: 1px;
      }
    }
  }

  .firstButton, .buttonFavorites, .input {
    display: none;
  }

  .buttonMenu {
    grid-area: buttonMenu;
    background: none;
    padding: 0;
    z-index: 3;

    > svg {
      color: ${({ theme }) => theme.COLORS.WHITE};
      height: 3rem;
      width: 3rem;
    }
  }

  .menuMobile {
    background: rgba(8, 8, 8, 0.64);
    width: 100vw;
    height: 100vh;

    position: absolute;
    top: 0;
    left: 0;

    display: none;
    z-index: 2;

    > div, .nav-menu {
      background: ${({ theme }) => theme.COLORS.BLACK};
      width: 70%;
      transform: translateX(-5em);
      animation: toRight 0.3s forwards;
    }

    > div {
      height: 16rem;
      padding-top: 10rem;
    }

    .input {
      display: flex;
    }

    .nav-menu {
      height: 100%;
      display: flex;
    }

    button {
      opacity: 1;
      animation: 0;
    }
  }
  
  @media(min-width: 1000px) {
    > :first-child {
      font-size: 1.3rem;
      justify-content: center;

      ul {
        position: absolute;
        right: 11.1rem;
        gap: 3.9rem;
      }
    }

    > :nth-child(2) {
      height: 9.9rem;

      grid-template-columns: 1fr 52.1rem 1fr;
      grid-template-areas: "logo input buttons";
      justify-items: center;

      > img {
        width: 15.4rem;
        height: 5.1rem;
      }
    }

    .buttonMenu {
      display: none;
    }

    .boxButtons {
      position: relative;
      z-index: 2;
      gap: 3rem;

      > button {
        z-index: -1;
      }

    }

    .firstButton, .buttonFavorites, .input {
      display: flex;
    }

    .firstButton {
      font-size: 1.7rem;
    }

    .input {
      height: 4rem;
    }
  }
`;