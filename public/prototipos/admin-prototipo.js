window.AnimalecPrototype = (function() {
  "use strict";
  const entities = {
    patrocinadores: {
      title: "Patrocinadores",
      singular: "patrocinador",
      owner: "dos patrocinadores",
      optional: "País",
      association: "Animais apoiados",
      requirement: "Seleciona pelo menos um animal.",
      choices: ["Animal A", "Animal B", "Animal C", "Animal D"],
      seeds: [
        ["Patrocinador 01", "patrocinador01@example.com", "Portugal", [0, 1]],
        ["Patrocinador 02", "patrocinador02@example.com", "", [1]]
      ]
    },
    especialistas: {
      title: "Especialistas científicos",
      singular: "especialista científico",
      owner: "dos especialistas",
      optional: "Instituição",
      association: "Espécies e famílias associadas",
      requirement: "Seleciona pelo menos uma espécie ou família.",
      choices: ["Espécie A", "Família B", "Espécie C", "Família D"],
      seeds: [
        [
          "Especialista 01",
          "especialista01@example.com",
          "Instituição A",
          [0, 1]
        ],
        ["Especialista 02", "especialista02@example.com", "", [1]]
      ]
    }
  };

  const menus = {
    patrocinadores: "patrocinadores.html",
    especialistas: "especialistas.html"
  };

  const data = new Map();
  const textEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  const escape = value =>
    String(value).replace(/[&<>"']/g, char => textEscapes[char]);

  function initialRecords(config) {
    return config.seeds.map(([name, email, optional, links], i) => ({
      id: i + 1,
      name,
      email,
      optional,
      links: links.map(index => config.choices[index])
    }));
  }

  function validRecords(records, config) {
    return (
      Array.isArray(records) &&
      records.every(
        record =>
          record &&
          Number.isSafeInteger(record.id) &&
          record.id > 0 &&
          ["name", "email", "optional"].every(
            key => typeof record[key] === "string"
          ) &&
          Array.isArray(record.links) &&
          record.links.every(link => config.choices.includes(link))
      )
    );
  }

  function storeFor(key, config) {
    const storageKey = "animalec.tarefa31b." + key;
    if (!data.has(key)) {
      let records;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) records = JSON.parse(saved);
      } catch {
        // The current page also works when storage is unavailable.
      }
      data.set(
        key,
        validRecords(records, config) ? records : initialRecords(config)
      );
    }
    return {
      get records() {
        return data.get(key);
      },
      save(records) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(records));
        } catch {
          // Keep the changes for this session.
        }
        data.set(key, records);
      }
    };
  }

  function optionsGroup(items) {
    return items
      .map(item => `<span class="ap-tag">${escape(item)}</span>`)
      .join("");
  }

  function actionButtons(id) {
    return `<div class="ap-actions">
      <button class="ap-btn" type="button" data-action="view" data-id="${id}">Ver</button>
      <button class="ap-btn" type="button" data-action="edit" data-id="${id}">Editar</button>
      <button class="ap-btn ap-danger" type="button" data-action="remove" data-id="${id}">Remover</button>
    </div>`;
  }

  function listContent(records, config) {
    if (!records.length)
      return '<p class="ap-empty">Ainda não existem registos.</p>';
    return `<div class="ap-table-wrap">
      <table class="ap-table">
        <caption class="ap-sr-only">${config.title}</caption>
        <thead><tr><th scope="col">Nome</th><th scope="col">Email</th><th scope="col">${
          config.optional
        }</th>
          <th scope="col">${
            config.association
          }</th><th scope="col">Ações</th></tr></thead>
        <tbody>${records
          .map(
            record => `<tr>
          <th scope="row">${escape(record.name)}</th>
          <td>${escape(record.email)}</td><td>${escape(
              record.optional || "—"
            )}</td>
          <td>${optionsGroup(record.links)}</td><td>${actionButtons(
              record.id
            )}</td>
        </tr>`
          )
          .join("")}</tbody>
      </table></div>
      <ul class="ap-cards" aria-label="${config.title}">${records
      .map(
        record => `<li>
        <h2>${escape(record.name)}</h2><p class="ap-email">${escape(
          record.email
        )}</p>
        <dl><dt>${config.optional}</dt><dd>${escape(
          record.optional || "—"
        )}</dd>
          <dt>${config.association}</dt><dd>${optionsGroup(
          record.links
        )}</dd></dl>
        ${actionButtons(record.id)}
      </li>`
      )
      .join("")}</ul>`;
  }

  function countryField(value) {
    const countries = ["Portugal", "Espanha", "França", "Brasil", "Outro"];
    return `<select name="optional" id="ap-optional">
      <option value="">Selecionar país</option>
      ${countries
        .map(
          country =>
            `<option${country === value ? " selected" : ""}>${country}</option>`
        )
        .join("")}
    </select>`;
  }

  function formContent(key, config, record) {
    const { name, email, optional, links } = record || {
      name: "",
      email: "",
      optional: "",
      links: []
    };
    return `<form class="ap-form">
      <p>Os campos com * são obrigatórios.</p>
      <div class="ap-fields">
        <div><label for="ap-name">Nome *</label><input id="ap-name" name="name" value="${escape(
          name
        )}" required maxlength="120" autocomplete="off"></div>
        <div><label for="ap-email">Email *</label><input id="ap-email" name="email" value="${escape(
          email
        )}" type="email" required maxlength="254" autocomplete="off" aria-describedby="ap-email-help">
          <small id="ap-email-help">O email deve ser único na lista ${
            config.owner
          }.</small></div>
        <div><label for="ap-optional">${
          config.optional
        } <span class="ap-muted">(opcional)</span></label>
          ${
            key === "patrocinadores"
              ? countryField(optional)
              : `<input id="ap-optional" name="optional" value="${escape(
                  optional
                )}" maxlength="120" autocomplete="off">`
          }</div>
      </div>
      <fieldset aria-describedby="ap-association-help"><legend>${
        config.association
      } *</legend>
        <p id="ap-association-help">${config.requirement}</p>
        <div class="ap-checks">${config.choices
          .map(
            choice =>
              `<label><input type="checkbox" name="links" value="${choice}"${
                links.includes(choice) ? " checked" : ""
              }> ${choice}</label>`
          )
          .join("")}</div>
      </fieldset>
      <p class="ap-error" role="alert" hidden></p>
      <div class="ap-actions"><button class="ap-btn ap-primary" type="submit">Guardar</button>
        <button class="ap-btn ap-neutral" type="button" data-action="cancel">Cancelar</button></div>
    </form>`;
  }

  function menuLink(url) {
    return `<a class="ap-btn ap-secondary" href="${escape(
      url
    )}" data-menu>Menu principal</a>`;
  }

  function mountEntity(root, key, navigation = {}) {
    const config = entities[key];
    if (!config) throw new Error("Entidade desconhecida");
    const store = storeFor(key, config);
    const menuUrl = navigation.menuUrl || "index.html";
    let editing = null;
    let returnFocus = null;

    const draw = (content, title, focus) => {
      root.innerHTML = `<nav class="ap-crumb" aria-label="Localização"><a href="${escape(
        menuUrl
      )}" data-menu>Administração</a>
        <span aria-hidden="true"> / </span><span aria-current="page">${
          config.title
        }</span></nav>
        <h1 tabindex="-1">${title}</h1>${content}`;
      if (focus) root.querySelector("h1").focus();
    };

    const list = ({ message = "", focus = false } = {}) => {
      editing = null;
      const count = store.records.length;
      draw(
        `<div class="ap-actions ap-toolbar"><button type="button" class="ap-btn ap-primary" data-action="add">Adicionar ${
          config.singular
        }</button>
        ${menuLink(menuUrl)}</div>
        <p class="ap-count">${count} ${count === 1 ? "registo" : "registos"}</p>
        ${listContent(store.records, config)}
        <p class="ap-message" role="status"${message ? "" : " hidden"}>${escape(
          message
        )}</p>`,
        config.title,
        focus
      );
    };

    const form = record => {
      editing = record;
      draw(
        formContent(key, config, record),
        `${record ? "Editar" : "Adicionar"} ${config.singular}`,
        true
      );
    };

    const showDialog = (record, remove, trigger) => {
      returnFocus = trigger;
      const dialog = document.createElement("dialog");
      dialog.className = "ap-dialog";
      dialog.setAttribute("aria-labelledby", "ap-dialog-title");
      const details = `<dl><dt>Nome</dt><dd>${escape(
        record.name
      )}</dd><dt>Email</dt><dd>${escape(record.email)}</dd>
        <dt>${config.optional}</dt><dd>${escape(record.optional || "—")}</dd>
        <dt>${config.association}</dt><dd>${optionsGroup(
        record.links
      )}</dd></dl>`;
      dialog.innerHTML = `<h2 id="ap-dialog-title">${
        remove ? "Confirmar remoção" : "Detalhes do registo"
      }</h2>
        ${
          remove
            ? `<p>Remover <strong>${escape(
                record.name
              )}</strong>? Os registos associados são conservados.</p>`
            : details
        }
        <form method="dialog" class="ap-actions">
          <button class="ap-btn ap-neutral" value="cancel" autofocus>${
            remove ? "Cancelar" : "Fechar"
          }</button>
          ${
            remove
              ? '<button class="ap-btn ap-danger" value="remove">Remover</button>'
              : ""
          }
        </form>`;
      root.append(dialog);
      dialog.addEventListener(
        "close",
        () => {
          if (dialog.returnValue === "remove") {
            store.save(store.records.filter(item => item.id !== record.id));
            list({ message: "Registo removido.", focus: true });
          } else {
            dialog.remove();
            returnFocus.focus();
          }
        },
        { once: true }
      );
      dialog.showModal();
    };

    const onClick = event => {
      const link = event.target.closest("[data-menu]");
      if (
        link &&
        navigation.goToMenu &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault();
        navigation.goToMenu();
        return;
      }
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const { action, id } = button.dataset;
      const record = store.records.find(item => item.id === Number(id));
      if (action === "add") form(null);
      if (action === "cancel") list({ focus: true });
      if (action === "edit" && record) form(record);
      if (action === "view" && record) showDialog(record, false, button);
      if (action === "remove" && record) showDialog(record, true, button);
    };

    const onSubmit = event => {
      const form = event.target;
      if (!form.matches(".ap-form")) return;
      event.preventDefault();
      const fields = new FormData(form);
      const name = fields.get("name").trim();
      const email = fields.get("email").trim();
      const links = fields.getAll("links");
      const message = form.querySelector(".ap-error");
      let error;
      let field;
      if (!name) {
        error = "Indica um nome.";
        field = form.elements.name;
      } else if (
        store.records.some(
          item =>
            item.id !== (editing && editing.id) &&
            item.email.toLowerCase() === email.toLowerCase()
        )
      ) {
        error = "Este email já está associado a um registo nesta lista.";
        field = form.elements.email;
      } else if (!links.length) {
        error = config.requirement;
        field = form.querySelector('[name="links"]');
      }
      if (error) {
        form
          .querySelectorAll("[aria-invalid]")
          .forEach(input => input.removeAttribute("aria-invalid"));
        message.hidden = false;
        message.textContent = error;
        field.setAttribute("aria-invalid", "true");
        field.focus();
        return;
      }
      const id = editing
        ? editing.id
        : store.records.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const record = {
        id,
        name,
        email,
        optional: fields.get("optional").trim(),
        links
      };
      const updated = editing
        ? store.records.map(item => (item.id === id ? record : item))
        : [...store.records, record];
      const feedback = editing ? "Registo atualizado." : "Registo adicionado.";
      store.save(updated);
      list({ message: feedback, focus: true });
    };

    root.addEventListener("click", onClick);
    root.addEventListener("submit", onSubmit);
    list();
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("submit", onSubmit);
      root.replaceChildren();
    };
  }

  function mountDemo(root) {
    const key = root.dataset.entity;
    if (key) return mountEntity(root, key);
    const existing = [
      ["U", "Utilizadores"],
      ["A", "Animais"],
      ["Q", "Quizzes"],
      ["?", "Questões"]
    ];
    root.innerHTML = `<h1>Gestão do Animalec</h1>
      <nav class="ap-grid" aria-label="Menu de administração">
        ${existing
          .map(
            ([icon, label]) =>
              `<div class="ap-tile ap-base"><span aria-hidden="true">${icon}</span><strong>${label}</strong><small>Na aplicação base</small></div>`
          )
          .join("")}
        ${Object.entries(entities)
          .map(
            ([entity, config]) =>
              `<a class="ap-tile" href="${
                menus[entity]
              }"><span aria-hidden="true">${config.title[0]}</span><strong>${
                config.title
              }</strong></a>`
          )
          .join("")}
      </nav>`;
  }

  return { mountEntity, mountDemo };
})();
