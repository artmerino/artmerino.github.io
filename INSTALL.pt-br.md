# Índice

- [Índice](#índice)
- [Instalando e Implantando](#instalando-e-implantando)
  - [Abordagem Recomendada](#abordagem-recomendada)
  - [Configuração local no Windows](#configuração-local-no-windows)
  - [Configuração local usando Docker (Recomendado)](#configuração-local-usando-docker-recomendado)
    - [Crie sua própria imagem Docker](#crie-sua-própria-imagem-docker)
    - [Encontrou erros na imagem Docker?](#encontrou-erros-na-imagem-docker)
  - [Configuração local com Containers de Desenvolvimento](#configuração-local-com-containers-de-desenvolvimento)
  - [Configuração Local (Legado, não mais suportado)](#configuração-local-legado-não-mais-suportado)
  - [Implantação](#implantação)
    - [Para páginas pessoais e de organizações](#para-páginas-pessoais-e-de-organizações)
    - [Para páginas de projetos](#para-páginas-de-projetos)
    - [Habilitando implantação automática](#habilitando-implantação-automática)
    - [Implantação manual no GitHub Pages](#implantação-manual-no-github-pages)
    - [Implantar no Netlify](#implantar-no-netlify)
    - [Implantação em outro servidor de hospedagem (que não seja o GitHub Pages)](#implantação-em-outro-servidor-de-hospedagem-que-não-seja-o-github-pages)
    - [Implantação em um repositório separado (somente para usuários avançados)](#implantação-em-um-repositório-separado-somente-para-usuários-avançados)
  - [Atualizando de uma versão anterior](#atualizando-de-uma-versão-anterior)

# Instalando e Implantando

## Abordagem Recomendada

A abordagem recomendada para usar o **al-folio** é criar primeiro seu próprio site utilizando o template com o mínimo de alterações possível e, somente quando estiver em funcionamento, personalizá-lo como você desejar. Dessa forma, fica mais fácil identificar o que pode causar um eventual problema em caso de bug. Os passos mínimos exigidos para criar seu próprio site são ([tutorial em vídeo aqui](assets/video/tutorial_al_folio.mp4)):

1. Crie um novo repositório utilizando este template. Para isso, clique em [Use this template -> Create a new repository](https://github.com/new?template_name=multi-language-al-folio&template_owner=george-gca) acima da lista de arquivos. Se você planeja enviar seu site para `<seu-usuario-github>.github.io`, note que o nome do seu repositório :warning: **DEVE SER** :warning: `<seu-usuario-github>.github.io` ou `<seu-orgname-github>.github.io`, conforme indicado na [documentação do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#types-of-github-pages-sites).
2. Neste novo repositório, vá em [Settings -> Actions -> General -> Workflow permissions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#configuring-the-default-github_token-permissions) e conceda `Read and write permissions` ao GitHub Actions.
3. Abra o arquivo `_config.yml`, defina `url` para `https://<seu-usuario-github>.github.io` e deixe `baseurl` **vazio** (não o apague), como em `baseurl:`.
4. Aguarde até que a action do GitHub com o subtítulo `Deploy site` termine (verifique a aba **Actions** do repositório), o que leva em média ~4 min. Agora, além da branch `main`, seu repositório terá uma nova branch `gh-pages` gerada.
5. Por fim, na página do repositório, vá para `Settings -> Pages -> Build and deployment`, certifique-se de que a opção `Source` esteja definida como `Deploy from a branch` e escolha a branch `gh-pages` (não a `main`).
6. Aguarde até que a action do GitHub `pages-build-deployment` termine (verifique a aba **Actions** do repositório), o que leva em torno de ~45s, e então navegue para `https://<seu-usuario-github>.github.io` no seu navegador. Neste ponto, você deverá ver uma cópia do [site demo](https://george-gca.github.io/multi-language-al-folio/) do tema.

   Após tudo estar configurado, você pode clonar (baixar) o repositório para sua máquina e começar a personalizá-lo. Para isso, execute os seguintes comandos:

```bash
$ git clone git@github.com:<seu-usuario>/<nome-do-seu-repositório>.git
```

A partir da versão [v0.3.5](https://github.com/alshedivat/al-folio/releases/tag/v0.3.5), o **al-folio** re-implantará automaticamente sua página da web sempre que você enviar novas alterações para o seu repositório! :sparkles:

## Configuração local no Windows

Se você está usando o Windows, é **altamente recomendado** usar o [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install), que é uma camada de compatibilidade para rodar Linux no Windows. Você pode seguir [essas instruções](https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-11-with-gui-support) para instalar o WSL e o Ubuntu na sua máquina. Você só precisa seguir até o passo 4 do tutorial (não é necessário habilitar o `systemd` opcional nem os aplicativos gráficos), e então pode seguir as instruções abaixo para instalar o Docker. Também é possível instalar o Docker nativamente no Windows, mas ele tem apresentado alguns problemas, como pode ser visto em [#1540](https://github.com/alshedivat/al-folio/issues/1540) e [#2007](https://github.com/alshedivat/al-folio/issues/2007).

## Configuração local usando Docker (Recomendado)

Usar o Docker para instalar o Jekyll e as dependências do Ruby é a maneira mais fácil.

Você precisa seguir os seguintes passos para fazer o `al-folio` funcionar na sua máquina local:

- Primeiro, instale o [docker](https://docs.docker.com/get-docker/) e o [docker-compose](https://docs.docker.com/compose/install/).
- Por fim, execute o seguinte comando que irá baixar a imagem pré-construída mais recente do DockerHub e executará seu site.

```bash
$ docker compose pull
$ docker compose up
```

Observe que, quando você executá-lo pela primeira vez, ele fará o download de uma imagem docker de cerca de 400MB. Para ver o template em execução, abra seu navegador e vá para `http://localhost:8080`. Você deve ver uma cópia do site demo do tema.

Agora, sinta-se à vontade para personalizar o tema como quiser (não se esqueça de mudar o nome!). Além disso, suas alterações devem ser renderizadas automaticamente em tempo real (ou talvez após alguns segundos).

> Beta: Você também pode usar a imagem docker reduzida com um tamanho abaixo de 100MB e a mesma funcionalidade. Basta usar `docker compose -f docker-compose-slim.yml up`

### Crie sua própria imagem Docker

> Nota: essa abordagem só é necessária se você quiser construir uma versão mais antiga ou muito personalizada do multi-language-al-folio.

Crie e execute uma nova imagem docker usando:

```bash
$ docker compose up --build
```

> Se você quiser atualizar o jekyll, instalar novos pacotes ruby, etc., tudo o que você precisa fazer é construir a imagem novamente usando o argumento `--force-recreate` no final do comando anterior! Isso fará o download do Ruby e do Jekyll e instalará todos os pacotes Ruby novamente do zero.

Se você quiser usar uma versão específica do docker, pode fazê-lo alterando a tag `latest` para `sua_versão` no `docker-compose.yaml`. Por exemplo, você pode ter criado seu site na versão `v0.10.0` e deseja permanecer com essa versão.

### Encontrou erros na imagem Docker?

Às vezes, pode haver alguns bugs na imagem docker atual. Pode ser um erro de versão ou qualquer outra coisa. Se você quiser depurar e resolver facilmente o problema por conta própria, pode seguir os passos a seguir:

```
docker compose up -d
docker compose logs
```

Então você pode ver o bug! Você pode entrar no contêiner com este comando:

```
docker compose exec -it jekyll /bin/bash
```

Então você pode executar o script:

```
./bin/entry_point.sh
```

Você pode ver problemas de dependência de pacote ou algo que não está disponível. Você pode corrigir isso agora usando

```
bundle install
./bin/entry_point.sh
```

Na maioria das vezes, isso resolverá o problema, mas não deveria realmente acontecer. Portanto, por favor, abra um relatório de bug para nós.

## Configuração local com Containers de Desenvolvimento

O `al-folio` suporta [Containers de Desenvolvimento](https://containers.dev/supporting).
Por exemplo, quando você abre o repositório com o Visual Studio Code (VSCode), ele solicita que você instale a extensão necessária e instala automaticamente tudo o que é necessário.

## Configuração Local (Legado, não mais suportado)

Para um tutorial prático de como rodar o multi-language-al-folio localmente sem usar o Docker, confira [este blog interessante](https://george-gca.github.io/blog/2022/running-local-al-folio/) de um dos membros da comunidade!

Assumindo que você tenha [Ruby](https://www.ruby-lang.org/pt/downloads/) e [Bundler](https://bundler.io/) instalados no seu sistema (_dica: para facilitar o gerenciamento de gems do Ruby, considere usar [rbenv](https://github.com/rbenv/rbenv)_), e também [Python](https://www.python.org/) e [pip](https://pypi.org/project/pip/) (_dica: para facilitar o gerenciamento de pacotes Python, considere usar um ambiente virtual, como [venv](https://docs.python.org/pt-br/3/library/venv.html) ou [conda](https://docs.conda.io/en/latest/)_).

```bash
$ bundle install
# assumindo que pip é o seu gerenciador de pacotes Python
$ pip install jupyter
$ bundle exec jekyll serve
```

Para ver o template em execução, abra seu navegador e vá para `http://localhost:4000`. Você deverá ver uma cópia do [site demo](https://george-gca.github.io/multi-language-al-folio/) do tema. Agora, sinta-se à vontade para personalizar o tema como quiser. Após terminar, lembre-se de **commitar** suas alterações finais.

## Implantação

Implantar seu site no [GitHub Pages](https://pages.github.com/) é a opção mais popular.
A partir da versão [v0.3.5](https://github.com/alshedivat/al-folio/releases/tag/v0.3.5), o **al-folio** re-implantará automaticamente sua página da web sempre que você enviar novas alterações para o seu repositório **branch principal**! :sparkles:

### Para páginas pessoais e de organizações

1. O nome do seu repositório **DEVE SER** `<seu-usuario-github>.github.io` ou `<sua-organizacao-github>.github.io`.
2. No arquivo `_config.yml`, defina `url` como `https://<seu-usuario-github>.github.io` e deixe `baseurl` vazio.
3. Configure a implantação automática da sua página (veja as instruções abaixo).
4. Faça alterações na sua branch principal, faça o commit e envie!
5. Após a implantação, a página estará disponível em `<seu-usuario-github>.github.io`.

### Para páginas de projetos

1. No arquivo `_config.yml`, defina `url` como `https://<seu-usuario-github>.github.io` e `baseurl` como `/<nome-do-seu-repositorio>/`.
2. Configure a implantação automática da sua página (veja as instruções abaixo).
3. Faça alterações na sua branch principal, faça o commit e envie!
4. Após a implantação, a página estará disponível em `<seu-usuario-github>.github.io/<nome-do-seu-repositorio>/`.

### Habilitando implantação automática

1. Clique na aba **Actions** e **Habilite o GitHub Actions**; não se preocupe em criar workflows, pois tudo já está configurado para você.
2. Vá para `Settings -> Actions -> General -> Workflow permissions` e conceda `Read and write permissions` ao GitHub Actions.
3. Faça quaisquer outras alterações na sua página, faça o commit e envie para a branch principal. Isso acionará automaticamente a ação **Deploy**.
4. Aguarde alguns minutos e deixe a ação ser concluída. Você pode acompanhar o progresso na aba **Actions**. Se concluído com sucesso, além da branch `main`, seu repositório agora terá uma nova branch `gh-pages` criada. **Não toque nesta branch!**
5. Finalmente, nas **Configurações** do seu repositório, na seção Pages, defina a branch como `gh-pages` (**NÃO** como `main`). Para mais detalhes, veja [Configurando uma fonte de publicação para seu site GitHub Pages](https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source).

Se você mantém seu site em outra branch, abra `.github/workflows/deploy.yml` **na branch onde você mantém seu site** e altere `on->push->branches` e `on->pull_request->branches` para a branch onde você mantém seu site. Isso acionará a ação em pulls/pushes nessa branch. A ação então implantará o site na branch de onde foi acionada.

### Implantação manual no GitHub Pages

Se você precisar reimplantar manualmente seu site no GitHub Pages, vá para a aba Actions, clique em "Deploy" na barra lateral esquerda e depois em "Run workflow".

### Implantar no [Netlify](https://www.netlify.com/)

1. [Use este template -> Crie um novo repositório](https://github.com/new?template_name=al-folio&template_owner=alshedivat).
2. Netlify: **Adicione um novo site** -> **Importe um projeto existente** -> **GitHub** e dê acesso ao Netlify ao repositório que você acabou de criar.
3. Netlify: Nas configurações de implantação

- Defina **Branch to deploy** como `main`
- **Base directory** deve estar vazia
- Defina **Build command** como `sed -i "s/^\(baseurl: \).*$/baseurl:/" _config.yml && bundle exec jekyll build`
- Defina **Publish directory** como `_site`

4. Netlify: Adicione as seguintes duas **variáveis de ambiente**

- | Chave          | Valor                                                                                            |
  | -------------- | ------------------------------------------------------------------------------------------------ |
  | `JEKYLL_ENV`   | `production`                                                                                     |
  | `RUBY_VERSION` | defina como a versão do Ruby encontrada em `.github/workflows/deploy.yml` (por exemplo, `3.3.5`) |

5. Netlify: Clique em **Deploy** e aguarde o site ser publicado. Se você quiser usar seu próprio nome de domínio, siga os passos nesta [documentação](https://docs.netlify.com/domains-https/custom-domains/).

### Implantação em outro servidor de hospedagem (que não seja o GitHub Pages)

Se você decidir não usar o GitHub Pages e hospedar sua página em outro lugar, simplesmente execute:

```bash
$ bundle exec jekyll build
```

Isso irá (re)gerar a página estática na pasta `_site/`.
Depois, basta copiar o conteúdo do diretório `_site/` para o servidor de hospedagem.

Se você também quiser remover classes CSS não utilizadas do seu arquivo, execute:

```bash
$ purgecss -c purgecss.config.js
```

Isso substituirá os arquivos CSS na pasta `_site/assets/css/` pelos arquivos CSS purgados.

**Nota:** Certifique-se de configurar corretamente os campos `url` e `baseurl` no arquivo `_config.yml` antes de construir a página. Se você estiver implantando sua página em `seu-dominio.com/seu-projeto/`, você deve definir `url: seu-dominio.com` e `baseurl: /seu-projeto/`. Se você estiver implantando diretamente em `seu-dominio.com`, deixe `baseurl` vazio, **não o exclua**.

### Implantação em um repositório separado (somente para usuários avançados)

**Nota:** Não tente usar este método a menos que você saiba o que está fazendo (certifique-se de estar familiarizado com [fontes de publicação](https://help.github.com/pt/github/working-with-github-pages/about-github-pages#publishing-sources-for-github-pages-sites)). Esta abordagem permite ter o código-fonte do site em um repositório e a versão implantada em outro repositório.

Vamos supor que a fonte de publicação do seu site seja um subdiretório `publishing-source` de um repositório versionado com git clonado em `$HOME/repo/`.
Para um site de usuário, isso pode ser algo como `$HOME/<usuario>.github.io`.

Primeiramente, no diretório do repositório de implantação, faça checkout da branch git que hospeda sua fonte de publicação.

Depois, no diretório das fontes do site (geralmente o clone do fork do multi-language-al-folio):

```bash
$ bundle exec jekyll build --destination $HOME/repo/publishing-source
```

Isso instruirá o jekyll a implantar o site em `$HOME/repo/publishing-source`.

**Nota:** O Jekyll limpará `$HOME/repo/publishing-source` antes de construir!

A citação abaixo é retirada diretamente da [documentação de configuração do jekyll](https://jekyllrb.com/docs/configuration/options/):

> Pastas de destino são limpas nas construções do site
>
> O conteúdo de `<destination>` é automaticamente limpo, por padrão, quando o site é construído. Arquivos ou pastas que não são criados pelo seu site serão removidos. Alguns arquivos podem ser mantidos especificando-os dentro da diretiva de configuração `<keep_files>`.
>
> Não use um local importante para `<destination>`; em vez disso, use-o como uma área de preparação e copie os arquivos de lá para o seu servidor web.

Se `$HOME/repo/publishing-source` contiver arquivos que você deseja que o jekyll deixe intocados, especifique-os em `keep_files` no `_config.yml`.
Na configuração padrão, o multi-language-al-folio copiará o `README.md` do nível superior para a fonte de publicação. Se você quiser alterar esse comportamento, adicione `README.md` em `exclude` no `_config.yml`.

**Nota:** _Não_ execute `jekyll clean` no repositório da fonte de publicação, pois isso resultará na exclusão de todo o diretório, independentemente do conteúdo de `keep_files` no `_config.yml`.

## Atualizando de uma versão anterior

Se você instalou o **multi-language-al-folio** conforme descrito acima, pode atualizar manualmente seu código seguindo os passos abaixo:

```bash
# Assumindo que o diretório atual é <nome-do-seu-repositório>
$ git remote add upstream https://github.com/george-gca/multi-language-al-folio.git
$ git fetch upstream
$ git rebase v1.14.4
```

Se você personalizou extensivamente uma versão anterior, pode ser mais complicado atualizar.
Você ainda pode seguir os passos acima, mas o `git rebase` pode resultar em conflitos de merge que precisarão ser resolvidos.
Consulte o [manual do git rebase](https://help.github.com/pt/github/using-git/about-git-rebase) e como [resolver conflitos](https://help.github.com/pt/github/using-git/resolving-merge-conflicts-after-a-git-rebase) para mais informações.
Se o rebase for muito complicado, recomendamos reinstalar a nova versão do tema do zero e portar manualmente seu conteúdo e alterações da versão anterior. Você pode usar ferramentas como [meld](https://meldmerge.org/) ou [winmerge](https://winmerge.org/) para ajudar nesse processo.
