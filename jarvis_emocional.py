import json
from datetime import datetime

# ================================
# CARREGAR CONFIGURAÇÃO
# ================================

def carregar_config():
    with open("config.json", "r", encoding="utf-8") as arquivo:
        return json.load(arquivo)

config = carregar_config()

# ================================
# FUNÇÕES DO JARVIS
# ================================

def salvar_historico(texto):
    if config.get("salvar_historico"):
        with open("historico.txt", "a", encoding="utf-8") as h:
            data = datetime.now().strftime("%d/%m/%Y %H:%M")
            h.write(f"[{data}] {texto}\n")


def acolhimento():
    print("\nJARVIS:")
    print(f"Estou aqui, {config['nome_usuario']}.")
    print("Obrigado por confiar em mim.\n")

    if config.get("usar_fe"):
        print("Deus continua cuidando de você, mesmo nesse momento.\n")


def escuta():
    print("Pode me contar o que está acontecendo.")
    texto = input("Você: ")
    salvar_historico(f"Usuário: {texto}")
    return texto


def validacao():
    print("\nJARVIS:")
    print("Entendo.")
    print("Faz sentido você se sentir assim.\n")
    salvar_historico("JARVIS validou o sentimento")


def clareza():
    print("JARVIS:")
    print("Se quiser, vamos organizar isso juntos.")
    print("Responda apenas se se sentir à vontade.\n")

    fora = input("O que disso está fora do seu controle? ")
    dentro = input("O que ainda depende de você hoje? ")

    salvar_historico(f"Fora do controle: {fora}")
    salvar_historico(f"No controle: {dentro}")


def forca():
    print("\nJARVIS:")
    print("Você não precisa resolver tudo hoje.")
    print("Continuar já é suficiente.\n")
    salvar_historico("JARVIS reforçou força")


def escolha():
    print("JARVIS:")
    print("Como posso te ajudar agora?")
    print("1 - Só ouvir")
    print("2 - Pensar junto")
    print("3 - Uma palavra de força")
    print("4 - Ficar em silêncio\n")

    opcao = input("Escolha (1-4): ")
    salvar_historico(f"Escolha do usuário: {opcao}")
    return opcao


def resposta_escolha(opcao):
    print("\nJARVIS:")

    if opcao == "1":
        print("Estou ouvindo. Pode continuar.\n")
        texto = input("Você: ")
        salvar_historico(f"Usuário: {texto}")

    elif opcao == "2":
        print("Vamos pensar juntos, sem pressa.")
        texto = input("O que mais está passando pela sua mente? ")
        salvar_historico(f"Reflexão: {texto}")

    elif opcao == "3":
        print("Você não está quebrado.")
        print("Você está atravessando algo difícil — e isso vai passar.\n")
        salvar_historico("JARVIS deu palavra de força")

    elif opcao == "4":
        print("Tudo bem.")
        print("Eu fico aqui com você.\n")
        salvar_historico("Usuário escolheu silêncio")

    else:
        print("Está tudo bem não saber escolher agora.\n")
        salvar_historico("Escolha inválida")


def encerramento():
    print("JARVIS:")
    print("Quando sair daqui, tente não ficar sozinho se puder.")
    print("Falar com alguém de confiança pode ajudar.")
    print("Estou aqui sempre que precisar conversar.\n")
    salvar_historico("Conversa encerrada")

# ================================
# EXECUÇÃO PRINCIPAL
# ================================

def jarvis_emocional():
    acolhimento()
    texto = escuta()

    sentimento = analisar_sentimento(texto)

    if sentimento == "triste":
        print("\nJARVIS:")
        print("Sinto muito que você esteja se sentindo assim.")
        print("Você não precisa passar por isso sozinho.\n")
    else:
        validacao()

    clareza()
    forca()
    opcao = escolha()
    resposta_escolha(opcao)
    encerramento()


if __name__ == "__main__":
    print("=== JARVIS | Apoio Emocional ===")
    jarvis_emocional()
