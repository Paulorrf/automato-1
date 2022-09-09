const reservedWords = [
  "int",
  "double",
  "float",
  "real",
  "break",
  "case",
  "const",
  "continue",
  "char",
];

const printScreen = (arr, id) => {
  let ul = document.createElement("ul");

  //obj
  if (id === "tokens") {
    arr.map((val) => {
      let li = document.createElement("li");
      li.innerHTML = val.msg;
      ul.appendChild(li);
    });
    document.getElementById(id).appendChild(ul);
    return;
  }

  //arr
  arr.map((val) => {
    let li = document.createElement("li");
    li.innerHTML = val;
    ul.appendChild(li);
  });
  document.getElementById(id).appendChild(ul);
};

//verificar se é uma variavel
//true se for e false se não for
//uma variavel só pode ter letras de a-z, A-Z e de 0-9
const verifyVariableOrReserved = (value) => {
  //caso nao comece por letra
  if (
    !(
      (value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90) ||
      (value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122)
    )
  ) {
    return false;
  }

  //caso tenha algum simbolo no meio
  for (let i = 0; i < value.length; i++) {
    if (
      !(
        (value.charCodeAt(i) >= 48 && value.charCodeAt(i) <= 57) ||
        (value.charCodeAt(i) >= 65 && value.charCodeAt(i) <= 90) ||
        (value.charCodeAt(i) >= 97 && value.charCodeAt(i) <= 122)
      )
    ) {
      return false;
    }
  }

  //é uma palavra reservada
  if (reservedWords.includes(value)) return { isVar: false, isReserved: true };

  //é uma variavel
  return { isVar: true, isReserved: false };
};

const verifyNum = (value) => {
  if (Number(value)) {
    if (value.includes(".")) {
      if (value.split(".")[1].length < 3 && value.split(".")[1].length !== 0) {
        if (Number(value) < 100.0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      if (Number(value) < 100.0) {
        return true;
      } else {
        return false;
      }
    }
  }
};

const verifyComment = (value) => {
  return value[0] === "/" && value[1] === "/";
};

const request = async () => {
  const response = await fetch("./testeSemi.txt");
  const data = await response.text();
  const fileContent = data.split(/\r?\n/);

  let errorItems = [];
  let symbols = [];
  let tokens = [];
  let tokenCount = 1;
  let identCount = 1;
  let symbolsCount = 1;

  //filtra somente as entradas que não deram erro
  let newFileContent = fileContent.filter((value) => {
    //é uma variavel
    if (verifyVariableOrReserved(value).isVar) {
      //verifica se ja tem uma variavel com o mesmo nome
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].value === value) {
          tokens.push({
            identCount: tokens[i].identCount,
            value,
            msg: `[${tokenCount}] IDENTIFICADOR ${tokens[i].identCount}`,
          });
          tokenCount++;
          return true;
        }
      }

      //adiciona na tabela de tokens
      tokens.push({
        identCount,
        value,
        msg: `[${tokenCount}] IDENTIFICADOR ${identCount}`,
      });

      //adiciona na tabela de simbolos
      symbols.push(`${symbolsCount} - ${value}`);

      symbolsCount++;
      tokenCount++;
      identCount++;
      return true;

      //É uma palavra reservada
    } else if (verifyVariableOrReserved(value).isReserved) {
      //adiciona na tabela de tokens
      tokens.push({
        identCount,
        value,
        msg: `[${tokenCount}] ${value.toUpperCase()}`,
      });

      tokenCount++;
      return true;
    } else if (verifyNum(value)) {
      tokens.push({
        identCount,
        value,
        msg: `[${tokenCount}] NÚMERO ${
          value % 1 === 0 ? "INTEIRO" : "REAL"
        } ${identCount}`,
      });
      symbols.push(`${symbolsCount} - ${value}`);

      symbolsCount++;
      tokenCount++;
      identCount++;
      return true;
    } else if (verifyComment(value)) {
      tokens.push({
        identCount,
        value,
        msg: `[${tokenCount}] COMENTARIO`,
      });
      tokenCount++;
      return true;
    }
    errorItems.push(`${tokenCount} (${value})`);
    tokenCount++;
    return false;
  });

  printScreen(tokens, "tokens");
  printScreen(symbols, "symbols");
  printScreen(errorItems, "errors");

  // console.log(tokens);
  // console.log(newFileContent);
  // console.log(errorItems);
  // console.log(symbols);
};

request();
