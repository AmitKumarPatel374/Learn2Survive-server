const mongoose = require("mongoose")

const { Schema } = mongoose

/* =========================
   Overview
========================= */

const OverviewSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    causes: [
      {
        type: String,
        trim: true,
      },
    ],

    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],

    types: [
      {
        title: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { _id: false }
)

/* =========================
   Preparedness
========================= */

const PreparednessStepSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    steps: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: false }
)

const PreparednessSchema = new Schema(
  {
    before: PreparednessStepSchema,

    during: PreparednessStepSchema,

    after: PreparednessStepSchema,
  },
  { _id: false }
)

/* =========================
   Do's & Don'ts
========================= */

const SafetySectionSchema = new Schema(
  {
    title: String,

    description: String,

    items: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: false }
)

const DosDontsSchema = new Schema(
  {
    dos: SafetySectionSchema,

    donts: SafetySectionSchema,
  },
  { _id: false }
)

/* =========================
   Emergency Kit
========================= */

const EmergencyKitItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    quantity: String,

    description: String,

    priority: {
      type: String,
      enum: ["Essential", "High", "Medium", "Low"],
      default: "Medium",
    },

    icon: String,
  },
  { _id: false }
)

const EmergencyKitSchema = new Schema(
  {
    title: String,

    description: String,

    items: [EmergencyKitItemSchema],
  },
  { _id: false }
)

/* =========================
   Resources
========================= */

const ResourceSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["video", "pdf", "website"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    thumbnail: String,

    url: String,

    duration: String,

    source: String,

    file: String,
  },
  { _id: false }
)

/* =========================
   FAQ
========================= */

const FAQSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

/* =========================
   Metadata
========================= */

const EmergencyNumberSchema = new Schema(
  {
    name: String,

    number: String,
  },
  { _id: false }
)

const MetadataSchema = new Schema(
  {
    searchKeywords: [String],

    hazardLevel: {
      type: String,
      enum: ["Low", "Moderate", "High", "Very High", "Extreme"],
    },

    affectedAreas: [String],

    season: [String],

    sdgGoals: [String],

    emergencyNumbers: [EmergencyNumberSchema],

    createdBy: String,

    version: String,

    lastReviewed: Date,
  },
  { _id: false }
)

module.exports = { OverviewSchema ,PreparednessSchema,DosDontsSchema,EmergencyKitSchema,MetadataSchema,FAQSchema,ResourceSchema}
