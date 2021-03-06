import {
  Box,
  Text,
  TextField,
  Image,
  Button,
  Icon,
} from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

function getRandom() {
  const min = Math.ceil(1);
  const max = Math.floor(5);
  return Math.floor(Math.random() * (max - min)) + min;
}

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxNjE1MSwiZXhwIjoxOTU4ODkyMTUxfQ.j3BnsebwF52f9Wowb-64isuGgv7j__FqNC73czR2BAo";
const SUPABASE_URL = "https://xetwbojipbfetnfrgomf.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const imagemLoading = getRandom();

function escutaMensagensEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from("mensagens")
    .on("INSERT", (respostaLive) => {
      adicionaMensagem(respostaLive.new);
    })
    .subscribe();
}

//////Primeiro teste

export default function ChatPage() {
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([
    {
      id: 1,
      de: "loacir-zen",
      texto: "loacir-zen",
      hora: "",
    },
  ]);
  const [nome, setNome] = React.useState("");

  React.useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        // console.log('Dados da consulta:', data);
        setListaDeMensagens(data);
      });

    const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
      console.log("Nova mensagem:", novaMensagem);
      console.log("listaDeMensagens:", listaDeMensagens);
      // Quero reusar um valor de referencia (objeto/array)
      // Passar uma função pro setState

      // setListaDeMensagens([
      //     novaMensagem,
      //     ...listaDeMensagens
      // ])
      setListaDeMensagens((valorAtualDaLista) => {
        console.log("valorAtualDaLista:", valorAtualDaLista);
        return [novaMensagem, ...valorAtualDaLista];
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function getNome(user) {
    const response = await fetch(`https://api.github.com/users/${user}`);
    const dados = await response.json();
    setNome(dados.name);
    console.log("Esse é o nome: ", dados.name);
  }

  /*
    // Usuário
    - Usuário digita no campo textarea
    - Aperta enter para enviar
    - Tem que adicionar o texto na listagem
    
    // Dev
    - [X] Campo criado
    - [X] Vamos usar o onChange usa o useState (ter if pra caso seja enter pra limpar a variavel)
    - [X] Lista de mensagens 
    */
  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      // id: listaDeMensagens.length + 1,
      de: usuarioLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert([
        // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
        mensagem,
      ])
      .then(({ data }) => {
        console.log("Criando mensagem: ", data);
      });

    setMensagem("");
  }

  // function handleDeletaMensagem(id) {
  //   setListaDeMensagens(
  //     listaDeMensagens.filter((mensagem) => mensagem.id !== id)
  //   );
  // }

  function handleDeletMensagem(id) {
    supabaseClient
      .from("mensagens")
      .delete()
      .match({ id: id })
      .then(({ data }) => {
        const novaListaDeMensagens = listaDeMensagens.filter(
          (mensagemAtual) => {
            return mensagemAtual.id !== data[0].id;
          }
        );
        setListaDeMensagens(novaListaDeMensagens);
      });
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/09/old-library-1536x864.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
          opacity: 0.9,
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList
            mensagens={listaDeMensagens}
            // handleDeletMensagem={handleDeletMensagem}
            setListaDeMensagens={setListaDeMensagens}
          />
          {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />

            <ButtonSendSticker
              onStickerClick={(sticker) => {
                console.log("Salva esse sticker no banco");
                handleNovaMensagem(":sticker: " + sticker);
              }}
            />

            <Button
              type="submit"
              label="Enviar"
              fullWidth
              onClick={(event) => {
                event.preventDefault();
                handleNovaMensagem(mensagem);
              }}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[800],
                mainColorLight: appConfig.theme.colors.primary[600],
                mainColorStrong: appConfig.theme.colors.primary[900],
              }}
              styleSheet={{
                backgroundRepeat: "no-repeat",
                backgroundSize: "20px",
                backgroundPosition: "center",
                height: "38px",

                width: "58px",
                marginTop: "-6px",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  function handleDeletarMensagem(id) {
    supabaseClient
      .from("mensagens")
      .delete()
      .match({ id: id })
      .then(() => {
        let novaListaDeMensagens = props.mensagens.filter((mensagem) => {
          if (mensagem.id !== id) {
            return mensagem;
          }
        });
        props.setListaDeMensagens([...novaListaDeMensagens]);
      });
  }
  console.log(props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            {mensagem.texto == "loacir-zen" ? (
              <Box
                styleSheet={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  //backgroundColor: "black",
                  overflow: "hidden",
                  position: "absolute",
                  justifyContent: "center",
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                  top: "0",
                  left: "0",
                }}
              >
                <Image
                  styleSheet={{
                    width: "50%",
                    position: "relative",
                    margin: "0 auto",
                  }}
                  src={`/images/${imagemLoading}.gif`}
                />
              </Box>
            ) : (
              ""
            )}

            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>

              <Icon
                name={"FaTrash"}
                styleSheet={{
                  marginLeft: "5px",
                  width: "20px",
                  height: "20px",
                  float: "right",
                  color: appConfig.theme.colors.primary["950"],
                  hover: {
                    color: "white",
                  },
                  display: "inline-block",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  handleDeletarMensagem(mensagem.id);
                }}
              />
            </Box>
            {/*} Condicional: {mensagem.texto.startsWith(":sticker:").toString()} */}
            {mensagem.texto.startsWith(":sticker:") ? (
              <Image src={mensagem.texto.replace(":sticker:", "")} />
            ) : (
              mensagem.texto
            )}
          </Text>
        );
      })}
    </Box>
  );
}
