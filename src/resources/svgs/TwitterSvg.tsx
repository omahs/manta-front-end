// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

const TwitterSvg = ({ className, fill }) => {
  return (
    <svg
      width="50px"
      height="44px"
      viewBox="0 0 50 44"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xlink="http://www.w3.org/1999/xlink"
      className={className}
      fill={fill}
    >
      <title>推特1</title>
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <image
          id="推特1"
          x="0"
          y="-3"
          width="50"
          height="50"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAyKADAAQAAAABAAAAyAAAAACbWz2VAAAO1UlEQVR4Ae2cjZajKBCFJ3v2vZo8WcyTST9Zb90MZGkTY6GA/FzOcUBFqPrgWpBk+s8fJhIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARLISOCSsW023TiBn58f41zwOU4t/kG6XC72Uej4Hwqk48HVuOZEYKTul6uPckyyrvK35HYE0cTAYd0GCYgoJndIliXN0qppEA1NHpWATNjcolhTWtNi4RKrc8VAGM7F28muWun/ziXYyaPA7v8n4KLG2pv9rOuzdGz+t/LcktiCyIqUzqakjZ3Lp8veZXz8oGPga03zmfAFSrjkTGuLND7jONNB9v1KwA26ZE0l8+pJ3itCZ/kCSWtDgH/K6wpb1xJ4M+jBMFVfzP6ydXyWwgCYtH27jtCwTxSJdhZnqicD8W7g/fi0ks9iqEmNSNoEG7S9lqakfa70kraTpBb33ZiMx7wyJq1eNilGTJzXvjSS9PewWTo1H6in6ygFoc7b2BiLD8PUxK1pz/CJZxCFVhgAkXx5NaPVtbTHKT4TT0D4x0yCteGq/fqkIeNY7OVhNH2o6oghRkE0rSJVlo1VSTkOiqFqosq0HF2xGmLAMctxJL20vewr6lws0QgEBqftOMrK/isL3xmQB0qz+ApBpEzqF7n6pyZiHRo1yimInxRMyrqspiQQOQbKVoesdtX+5OWfCDwmou5NBnOKqM+qGwQcT7NRjbe3CeDlbber/a2hiiAyOEaqq8NS0DmMmYJzFncQOMB/R29dP4L/r3KN8VAbQUxMo0Hdm3vzBZdYjCFAccTQ2qx736yxqKAVyNfiuZhTiiSG1mvd2+slXtlB4CrRw8Y+pxVIbLvL+hTJkoji3EUPo6jKKp8J3PeIA01q9yA/n/tX34Whk7r24BVFINj3mcExHHX/0Jz7d6t39xbbqqa9j0iCv4YxaR8YtZ7jbkb1P5Hfu8Qh7Cd1/xgoOVInvQFqS/uqKMDn1NAHay96jgmf8AtJRO8/mxEk07S7iTGMJCtwhY2RWziY9hFQRw6IwnXx68MQWeU8Pg7WCMTss3HzKYjkyxuyWXusCr8GayzXD3lr5WmIA/lqcqL4kgpmpdLzuxKNQFbaSHIZyzeEsk2nkvTWQCPCw4iZOJjiCGAOTctHFjw1L55fc/FsgcAfg0MceesgKgyWNIM4GJJNd/EFoF2I4VOEWGsQ37RP4c0aBOLtuYmD3Jcwevj5oM2tVMRLJcWLBUL7lf75dXb+CUQyn2/GORaI7+acnpvuNRWzq0QPuyRRm0BgH5ZbSGZp7ADnKd6CA2BK7iKW9/ZdqzUKxNs5i0gmf8KcBDIRgDimtbZrFghsvolIhlhyiZ9G/MXBVI7Ay6Z82bVGIHb5UOHzkZdchVEP1R3E8fy+Y81zjUDWni19fUY0cW/a0n2X6I/7jxKU//ahEgeqbgpkbfNSzpdfPRk5g0imX1d5QgJ6AmpxoMmLpl2ZkD+aeoXrWOkPGyzkzadKGTfPdeFAlDjw7GYEcR28fIGy6PiMUyOdzjKxpjM6Z5/NEYgWBzzUCqRmGjcRCYRiajaStp1KYJc4YHEPAoEfRg6IpEmhUNwYwmwJy/DNT6vWelftQfCwDGKN+5A1v6zcaGZ/4gQyxPc9awOW6TrmwHSk7ZgIUuM+ZM13IzdmmXg4UGYaj8BhcQBZjEBaRGzE6BaEAjuZ0hCw0sz1aOTwpqgFkqpD33Hh3Eh/LQilMJbuuntsxmWu2lSeqQXiOkzWcSoHItsxUp9CiYTWUPXv1LbGCiS5AakdUrZnpB6EgjTLgXMmEnghECWQxpdZL867C0ZyiMQfOGcigQeBKIE4Zi19mhUzzEYq43gKRUSD8xLJluiEfcQTiBZIp1FkSc7IBXwv8RTLsgLPxyBw2eOmvFknee6259nGn7HO/kcUTflpiTBt6YvYWodx909K1hzaJRA0xgF9ILWPf+Vbe+RHBEOejuSx7J56hRO9xArsf0yK4HzEohGncfjlGOb5LAf+F+TjkHvaZLUVWa8cgd1/FwtKlUkw4jJra3SMVMDxSMLIF60rfLv8cR5EHVw37h6zSgjsFoizH1GEItENpnHVfP7gFghI1wprFSVwZImFNfck1nKpVXTI2FlJAocEAkOdSGxJo9kXCawQsCvXd18+LBDXM6PI7iHggzUTSCIQt9GkSGoeadq2i0ASgaBn7kd28edDlRPYFAg+z9f6QJFoSbFeKwQuW4aKQPBBvpXj7pZSW4/gW/ZJKvHj301SrJCSgMzPzfkc299mBJEGrRxGjlkmPg6UPyaxc5IK3JN8pMSbLRDQCCT0w8iJF8pHsVAkITaWCxCwOfrY+026ccbg90Yw7FsOK6JA+ZkgErmPcy63nlRYaInA5ppNJvgkDsVMcCv1H4KRPExzeMIyCSQmcHerlqTN7o0gn4wwchNHjKikOhMJ1Ecgdg9Snwe0iAT+ErA5QFAgOaiyzW4IbO5B4KnsQ3668ZiOdElA9h+quRzrPCNILDHWH4qAViD3oajQ2dYI2FwGawWSq3+2SwJVE1Cv27gPqXocRzfuKlsQmwMCI0gOqmyzGwIxAuE+pJth78uRXNEDlGIE0hdVetMLAZvTEbVARKVTTkPYNgnsJPC98znVY2qBuNa4zFJhZaWCBGzOvtSfYnkj+GmWJ8G8BgKysomewzF2x0YQtM0oEkOYdXMSsDkbR9vRAuFeJPeQsP2aCEQLxBnPKFLTKI5rS/Z5uEsgjCLjzsjRPN8lEAcpu3pHGwz6G0Xg5W8gRD2trLxbIC6KUCRK0KyWnMB38hbfNLhbIK4t+6ZNXiKBEgRsiU4OCUSiCIxkFCkxUuwjJFBkeYUODwkEDbillkWZiQR6I3BYIA4Io0hvM6Nuf4rNt0sqDvITFCNt8Y/DpQLKdlYJyKol2bxd7cTdSBVBsNSy0uZ1q0PeJ4GDBOzB56MeTyYQ9OpEUiz8RXnKyr0QKDq/soQqWW5NMhr806O9TMmK/Ci5vILbSSOI5yhOTFIuqnTfN/OuCdjS3mWJIN4Jbtw9CeaJCFzdMj5Rc9vNZBWI716Egk+3jD9nTgI7CODLweuO5w49kmWJtbTIOcYl1xIMz2MInDJ/ikQQT4FLLk+CeSwBeckWnaveviIRxHcmPiJMwtFT3gbeDubNEbBnWVxUIN5J0chEoXgazBUETnuhnhK2QiBu2YXvTEx4nWUScARO2Zx7+qcLxBuCnGIJabDsCFxltWHPolGVQEIIFEtIY9yyW4qfBiDrHsRN8r3OGXnwWw4rB9OYBO5nu50tgog4JnEu/D2Wdc5i0r9LX+6ieXeT18YjcHb0APFsAkHjIpIf5EwksIPAXQQy7Xgu6SNZl1hi6ekhMiktNlaMQA3igLNZBVKLk8VGlR2lIlDNizWrQBytapxNNXpsJy+Bml6sJQSSlyZb741AVS/USwm63KyXoNxHHxI9isxJLa1SEaSqt4IWDusVJ1DdPCmm1jffixSnzw7rJlBb9ACtUhGk7pGhdTUQuNZgxNKGYgJxn0xUF0KXQHh+CgH8Ytee0vNGp8WWWN4Obtg9CeYBgWutAikWQQIYjCIBDBb/3GsVB8ameARBp9ywgwKTEDj1P0NpRuAUgcAwEcksmUGZaVgC1S6t/IicJhAYwP2IH4Yh8+qjB0bljD1IOBu4HwlpDFSWfce1BXdPFYhAmgQSRdLCTElrYxPigMuXtH7va02WWkaexJ6EqX8CTSyt/DCcGkG8Ee5jvmbeKt5u5rsINLViqCKCeMyMJJ5Et3n1n1otyVcRQbxRQSSx/hrzbgjc3fg25VBVESQkJ9FkkvNbeI3lZgk0te8IKVcrEBjpllwQicE5U5sEJHJUPc8+Ua1qibU0FCFZjqtcvy/v8bwZAhi/ZlPVAvFURSSTlAHaysHUDoE7XnLtmPtq6eX1Ut1XuOyqe3wC63z0Dy61V2xOIB4xheJJVJl3IQ6QbVYg4bQIxILLJrzH8ikErq0vrTy1LgTinUHuxIJi+BGxwQWmIgS6EQdodSeQT1MgiDTmUz3e202gK3GAQhOfYu0ertcHjVzCwZSewL2XZVWIZogI4iIHfy0cjnzaMsQxpW2yjta6jyAiDgwcxZFvvnUrDiDrOoI4cYSb9XzTZMyWuxZHtwKhMIqotXtxdCkQioPiSEmgmyUWhZFyWnxsa4jI4Qk0LxAKww9lkXwocYBoswJxwoAP3ISDQv40nDiAtDmBUBj5lfCmh+ul8Z+tv/FJdakZgVAYqvHMUWlYcQBm9QLhHiPHnFe12c1P1lXerlSq9pt0CEOOH7Gbe4yVwct4GfuNa8b2m2m6qgjiosWX0DPNEOzPUIhj6s+tfR6dKhARhBGzcVAUAqGCRHEsBqGoQAJBwAwunRaDceIphbECP5tAFmJghFgZgAouUxwfBuHiJrJ/m38HdW1QXiuaxQ0KYQGk4lN+SqUYnEcECURiFM+wSvsEGDWUY/hriSVCmeQ5H02UTbBaYwQojogB+yUQPMdoEkGvraoUxo7xehGIb8MJZfbnzJslQGEcGLpVgfg2uezyJJrL72IxNuK2OcsrMnhTIN5WCsWTaCJn1Eg0TGqBoD/uTxJRz9cMhZGYbZRAfN8UiidRTU5hZBqKXQLxtlAonsRpOYWRGf0hgYS2uT0Kv0kPoeQp39Hshb+4zUN30Woygfh2GVU8ieQ5o0VypNsNJheI75JC8SQO5YwWh/AdfzibQELTKJaQhqoMYfA7DBWqvJWKCCR0gWIJaTzLVkrfclAUTyR1FIoLJHQ7EAsum/DeAGVECW62Kx/oUwUSsnFiwSX8mtig0Fmy4g+jRGODWo1AltwWgsFts6xT8bkV2yAGJC6b/nJo8t9qBfKO5hvRoJp5V7fQNSv9UAiFYJ/RTVMC+QQoEA+qGTnwpeVaMsENG5R90U96f47c+hP5ku5Z9teYkwAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkEAhAv8BjmBIqscfsIAAAAAASUVORK5CYII="
        ></image>
      </g>
    </svg>
  );
};

TwitterSvg.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string
};

export default TwitterSvg;
