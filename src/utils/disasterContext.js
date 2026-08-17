const buildDisasterContext = (disaster) => {
  if (!disaster) {
    return "No Learn2Survive safety guide is available."
  }

  return `
DISASTER: ${disaster.name}

OVERVIEW:
${disaster.overview?.description || "Not available"}

CAUSES:
${disaster.overview?.causes?.join("\n- ") || "Not available"}

BEFORE:
${disaster.preparedness?.before?.steps?.join("\n- ") || "Not available"}

DURING:
${disaster.preparedness?.during?.steps?.join("\n- ") || "Not available"}

AFTER:
${disaster.preparedness?.after?.steps?.join("\n- ") || "Not available"}

THINGS TO DO:
${disaster.dosDonts?.dos?.items?.join("\n- ") || "Not available"}

THINGS TO AVOID:
${disaster.dosDonts?.donts?.items?.join("\n- ") || "Not available"}

EMERGENCY KIT:
${
  disaster.emergencyKit?.items
    ?.map(
      (item) =>
        `- ${item.name}: ${item.quantity || ""} — ${
          item.description || ""
        }`
    )
    .join("\n") || "Not available"
}

FREQUENTLY ASKED QUESTIONS:
${
  disaster.faqs
    ?.map(
      (faq) =>
        `Q: ${faq.question}\nA: ${faq.answer}`
    )
    .join("\n\n") || "Not available"
}

EMERGENCY NUMBERS:
${
  disaster.metadata?.emergencyNumbers
    ?.map(
      (item) => `- ${item.name}: ${item.number}`
    )
    .join("\n") || "Not available"
}
`
}

module.exports = {
  buildDisasterContext,
}