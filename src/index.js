const {
  contentElements,
  contentRenderers,
  actions: builtinActions,
  setup: setupBuiltins
} = require('@botpress/builtins')

const registerCustom = require('./custom')

module.exports = async bp => {
  // This bot template includes a couple of built-in elements and actions
  // Please see the "@botpress/builtins" package to know more
  await registerBuiltin(bp)

  // Register custom actions, elements and renderers
  await registerCustom(bp)

  // Train the NLU model if using the Native NLU Engine
  if (bp.nlu && bp.nlu.provider && bp.nlu.provider.name === 'native') {
    await bp.nlu.provider.sync()
  }

  const webchat = {
    // host: '<host>',
    botId: '20181217', //The ID for your bot
    botName: 'ForWater',
    botAvatarUrl: 'https://jaldhara.blob.core.windows.net/portal-logo/dev_sunbird_logo.png', // You can provide a URL here
    botConvoTitle: 'ForWater',
    botConvoDescription: "Hello, I'm a ForWater bot!",
    backgroundColor: '#ffffff',
    textColorOnBackground: '#666666',
    foregroundColor: '#000000',
    textColorOnForeground: '#ffffff',
    welcomeMsgEnable: true,
    welcomeMsgDelay: 1000,
    welcomeMsgText: 'Hello world!'
  }

  bp.createShortlink('chat', '/lite', {
    m: 'channel-web',
    v: 'fullscreen',
    options: JSON.stringify({ config: webchat })
  })

  bp.logger.info(`------------`)
  bp.logger.info(`Webchat available at ${bp.botfile.botUrl}/s/chat`)
  bp.logger.info(`------------`)

  ////////////////////////////
  /// Conversation Management
  ////////////////////////////

  // All events that should be processed by the Flow Manager
  bp.hear({ type: /bp_dialog_timeout|text|message|quick_reply/i }, (event, next) => {
    bp.dialogEngine.processMessage(event.sessionId || event.user.id, event).then()
  })

  bp.hear(/GET_STARTED|hello|hi|hey/i, (event, next) => {
    event.reply('#welcome') // #welcome is the name of a message bloc defined in `content.yml`
  })
}

async function registerBuiltin(bp) {
  await setupBuiltins(bp)

  // Register all the built-in content elements
  // Such as Carousel, Text, Choice etc..
  for (const schema of Object.values(contentElements)) {
    await bp.contentManager.loadCategoryFromSchema(schema)
  }

  await bp.contentManager.recomputeCategoriesMetadata()

  // Register all the renderers for the built-in elements
  for (const renderer of Object.keys(contentRenderers)) {
    bp.renderers.register(renderer, contentRenderers[renderer])
  }

  // Register all the built-in actions
  bp.dialogEngine.registerActions(builtinActions)
}
