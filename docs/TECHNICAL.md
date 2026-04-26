# Especificações Técnicas

## Acesso Anônimo
O sistema identifica respondentes sem login através de um anonId gerado automaticamente e armazenado via cookie. Para segurança, é feito um cruzamento de fingerprint usando o IP e o User-Agent do navegador, evitando que uma mesma pessoa responda várias vezes a mesma pesquisa.

## Segurança
- Autenticação de administradores via JWT.
- Rate limit ativo em todos os endpoints para evitar sobrecarga.
- Validação de período: o sistema não aceita respostas se a pesquisa estiver fora da data de validade ou pausada.
- Validação de integridade de IDs (ObjectId do Mongo e tipos do MySQL).

## Banco de Dados
O projeto utiliza uma estrutura de banco híbrida (Multidatabase):

1. MongoDB: Utilizado para dados que mudam muito ou são volumosos, como as configurações das Pesquisas, as Questões e as Respostas coletadas.
2. MySQL: Utilizado para dados relacionais fixos, especificamente a tabela de Usuários e o controle de Autenticação.

### Modelagem de Entidades
*Conforme solicitado no Trello:*

- **Usuário (MySQL):** Armazena as informações de quem acessa o sistema. Atributos: `id`, `nome`, `email`, `senha`, `tipo`.
- **Pesquisa (MongoDB):** Define o cabeçalho e configurações da pesquisa. Atributos: `id`, `titulo`, `descricao`, `data_criacao`, `escopo`.
- **Questão (MongoDB):** As perguntas que compõem uma pesquisa. Atributos: `id`, `texto`, `tipo`, `survey_id`.
- **Resposta (MongoDB):** Registro da participação. Atributos: `id`, `user_id` (ou `anonId`), `survey_id`, `data_envio`.
- **RespostaItem (MongoDB):** O valor específico dado para cada questão. Atributos: `id`, `response_id`, `question_id`, `valor`.

## Configurações do Projeto
O backend foi construído em NestJS com as seguintes definições globais:
- Middleware de cookie-parser para gestão dos IDs anônimos.
- ValidationPipe para garantir que os dados enviados ao banco estejam no formato correto.
- CORS habilitado para comunicação com o frontend.
- TypeORM gerenciando as duas conexões (mongo e mysql) simultaneamente através do InjectRepository.

## Observações Gerais
As listagens na área administrativa são entregues por padrão em ordem decrescente (registros mais recentes primeiro).