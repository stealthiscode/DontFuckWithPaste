(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const add = document.querySelector('.add');
    const cancel = document.querySelector('.cancel');
    const container = document.querySelector('.container');
    const form = document.querySelector('.form');
    let rules = new DFWP.Rules();

    form.addEventListener('submit', event => {
      event.preventDefault();
      DFWP.storage.set({ rules: rules.serialize() });
      window.close();
    });

    cancel.addEventListener('click', event => {
      window.close();
    });

    DFWP.storage.get({ rules: [] }, ({ rules: values }) => {
      rules = DFWP.Rules.deserialize(values);

      chrome.tabs.query({active: true}, ([tab, ...rest]) => {
        const addHandler = () => {
          const rule = new DFWP.Rule(new URL(tab.url).origin);
          rules.add(rule);
          new DFWP.RuleView(rule, rules).render(container, '#new');
        };

        add.addEventListener('click', addHandler);

        const matching = rules.filter(rule => rule.test(tab.url));
        matching.forEach(rule => new DFWP.RuleView(rule, rules).render(container, '#existing'));

        if (!matching.length) {
          addHandler();
        }

        const remove = document.querySelector('.delete');
        remove.addEventListener('click', event => {
          DFWP.storage.set({ rules: rules.serialize() });
          window.close();
        });
      });
    });

  });
})();
