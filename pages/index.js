import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import React, { useState } from "react";
import { useRouter } from "next/router";
import appConfig from "../config.json";
import axios from "axios";

async function getNome(user) {
  const response = await fetch(`https://api.github.com/users/${user}`);
  const dados = await response.json();
  if (dados.message) {
    // return false;
  }

  return dados.name;
}

function Titulo(props) {
  const Tag = props.tag || "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals["000"]};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default function PaginaInicial() {
  const [username, setUsername] = React.useState("loacir-zen");
  const [nome, setNome] = React.useState("Loacir Zen");
  const [statusVisivel, setStatusVisivel] = React.useState("hidden");
  const [found, setFound] = React.useState(true);
  const roteamento = useRouter();

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage:
            "url(https://virtualbackgrounds.site/wp-content/uploads/2020/09/old-library-1536x864.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[700],
            opacity: 0.9,
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (infosDoEvento) {
              infosDoEvento.preventDefault();
              roteamento.push(`/chat?username=${username}`);
              //window.location.href = "/chat";
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Titulo tag="h2">Boas vindas de volta!</Titulo>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

            {/*<input
              type="text"
              value={username}
              onChange={function handler(event) {
                console.log("usuário digitou", event.target.value);
                //Onde está o valor?
                const valor = event.target.value;
                //Trocar o valor da variável
                //através do React e avise quem precisa
                setUsername(valor);
              }}
            />*/}

            <TextField
              value={username}
              onChange={function handler(event) {
                const valor = event.target.value;

                async function getNome(user) {
                  const response = await fetch(
                    `https://api.github.com/users/${user}`
                  );
                  const dados = await response.json();
                  setNome(dados.name);
                  console.log("Esse é o nome: ", dados.name);
                }

                if (valor.length > 2) {
                  appConfig.statusVisibility.visibility = "visible";
                  getNome(valor).then((e) => {
                    if (e) {
                      setFound(true);
                    } else {
                      setFound(false);
                    }
                  });
                } else {
                  setFound(true);
                  appConfig.statusVisibility.visibility = "hidden";
                }

                console.log("O status visivel é: ", statusVisivel);
                //Onde está o valor?
                //const valor = event.target.value;
                //Trocar o valor da variável
                //através do React e avise quem precisa

                setUsername(valor);
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              type="submit"
              label="Entrar"
              disabled={username.length < 3}
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              visibility: appConfig.statusVisibility.visibility,
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                padding: "10px 10px",
                borderRadius: "1000px",
                fontSize: 10,
              }}
            >
              {nome}
            </Text>
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
                border: "1px solid",
                borderColor: appConfig.theme.colors.primary[500],
              }}
              src={`https://github.com/${username}.png`}
              onError={function (error) {
                error.target.src = `https://icons.iconarchive.com/icons/custom-icon-design/silky-line-user/256/user-delete-icon.png`;
              }}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {username}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
