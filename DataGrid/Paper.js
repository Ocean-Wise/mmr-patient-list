import NormalPaper from 'material-ui/Paper';
import styled from 'styled-components';
import * as mixins from '../styles/mixins';

const Paper = styled(NormalPaper)`
    ${(props) => props.globalStyle}
    width: 450px;
    top: 60px;
    left: 100px;
    padding: 15px;
    overflow-y: scroll;
    max-height: 500px;
    margin: 0 auto;
    box-shadow: rgba(0,0,0,0.25) 0px 14px 45px, rgba(0,0,0,0.22) 0px 10px 18px !important;
    z-index: 20;

    #socialList {
      font-size: 14px;
      line-height: 18px;
      height: 36px;
      color: rgba(0, 0, 0, 0.54);
    }

    #socialImg {
      margin-bottom: 10px;
      border-radius: 5px;
    }

    #socialItem {
      margin-left: 15px;
      max-width: 450px;
      margin-top: 35px;
    }

    #socialText {
      max-width: 350px;
      overflow-wrap: break-word;
    }

    .last {
      padding-bottom: 10px !important;
    }

    #socialDivider {
      margin-left: -15px !important;
      margin-top: 25px !important;
      margin-bottom: 5px !important;
      max-width: inherit !important;
    }

    ${'' /* ${(props) => mixins.bp.lg.max + props.lgMax} */}

    ${mixins.bp.lg.max`
      ${(props) => props.lgMax}
      text-align: left;
      width: 420px;

      #socialItem {
        margin-left: 0px;
      }

      #socialDivider {
        margin-top: 60px !important;
        max-width: inherit !important;
      }

      .last {
        padding-bottom: 40px !important;
      }
    `};

    ${mixins.bp.xs.max`
      ${(props) => props.xsMax}
      text-align: left !important;
      width: ${(props) => props.mobile ? '350px' : null};

      #socialItem {
        margin-left: 0px;
      }

    `};
`;

export default Paper;
