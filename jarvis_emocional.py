import json

# ================================
# JARVIS - APOIO EMOCIONAL
# Criado para acolher, escutar e ajudar
# ================================

def acolhimento():
    print("\nJARVIS:")
    print("Estou aqui.")
    print("Obrigado por confiar em mim.\n")


def escuta():
    print("Pode me contar o que está acontecendo.")
    texto = input("Você: ")
    return texto


def validacao():
    print("\nJARVIS:")
    print("Entendo.")
    print("Dado tudo isso, faz sentido você se sentir assim.\n")


def clareza():
    print("JARVIS:")
    print("Se quiser, vamos organizar isso juntos.")
    print("Responda apenas se se sentir à vontade.\n")

    fora_controle = input("O que disso está fora do seu controle? ")
    no_controle = input("O que ainda depende de você hoje? ")

    return fora_controle, no_controle


def forca():
    print("\nJARVIS:")
    print("Você não precisa resolver tudo hoje.")
    print("Continuar já é suficiente.\n")


def escolha():
    print("JARVIS:")
    print("Como posso te ajudar agora?")
    print("1 - Só ouvir")
    print("2 - Pensar junto")
    print("3 - Uma palavra de força")
    print("4 - Ficar em silêncio\n")

    opcao = input("Escolha (1-4): ")
    return opcao


def resposta_escolha(opcao):
    print("\nJARVIS:")

    if opcao == "1":
        print("Estou ouvindo. Pode continuar.\n")
        input("Você: ")

    elif opcao == "2":
        print("Vamos pensar juntos, sem pressa.")
        input("O que mais está passando pela sua mente? ")

    elif opcao == "3":
        print("Você não está quebrado.")
        print("Você está atravessando algo difícil — e isso vai passar.\n")

    elif opcao == "4":
        print("Tudo bem.")
        print("Eu fico aqui com você.\n")

    else:
        print("Está tudo bem não saber escolher agora.\n")


def encerramento():
    print("JARVIS:")
    print("Quando sair daqui, tente não ficar sozinho se puder.")
    print("Falar com alguém de confiança pode ajudar.")
    print("Estou aqui sempre que precisar conversar.\n")


def jarvis_emocional():
    acolhimento()
    escuta()
    validacao()
    clareza()
    forca()
    opcao = escolha()
    resposta_escolha(opcao)
    encerramento()

def carregar_config():
    with open("config.json", "r",
              encoding="utf-8") as arquivo:
        return json.load(arquivo)

config = carregar_config()

# ===== EXECUÇÃO =====
if __name__ == "__main__":
    print("=== JARVIS | Apoio Emocional ===")
    jarvis_emocional()

if config["usar_fe"]:
    print("Deus continua cuidando de você mesmo nesse momento. ")

print(f"Estou aqui, {config['nome_usuario']}.")

if config["salvar_historico"]:
    with open("historico.txt", "a", encoding="utf-8") as h:
        h.write("Usuário iniciou conversa\n")
