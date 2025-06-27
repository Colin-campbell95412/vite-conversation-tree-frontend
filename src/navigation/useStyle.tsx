// styles/useStyle.js
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
  modalContent: css`
    padding: 20px;
  `,
  formContainer: css`
    max-width: 400px;
    margin: 0 auto;
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  `,
  forgotPasswordLink: css`
    color: #6253e1;
    &:hover {
      color: #04befe;
    }
  `,
  errorMessage: css`
    color: red;
    margin-top: -10px;
    margin-bottom: 10px;
  `,
}));

export default useStyle;