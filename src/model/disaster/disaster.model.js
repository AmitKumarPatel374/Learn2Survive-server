const mongoose = require('mongoose')
const { OverviewSchema, PreparednessSchema, DosDontsSchema, EmergencyKitSchema, ResourceSchema, FAQSchema, MetadataSchema } = require('./disaster.schema')



const { Schema } = mongoose

const DisasterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["Natural", "Human-Made"],
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Hydrological",
        "Geological",
        "Meteorological",
        "Climatological",
        "Environmental",
        "Oceanic",
        "Industrial",
        "Biological",
        "Radiological",
      ],
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    recommended: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    estimatedTime: Number,

    lessons: Number,

    thumbnail: String,

    bannerImage: String,

    icon: String,

    themeColor: String,

    shortDescription: String,

    longDescription: String,

    overview: OverviewSchema,

    preparedness: PreparednessSchema,

    dosDonts: DosDontsSchema,

    emergencyKit: EmergencyKitSchema,

    resources: [ResourceSchema],

    faqs: [FAQSchema],

    metadata: MetadataSchema,
  },
  {
    timestamps: true,
  }
)

/* Text Search */

DisasterSchema.index({
  name: "text",
  shortDescription: "text",
  "metadata.searchKeywords": "text",
})

/* Export */

const DisasterModel= mongoose.model("Disaster", DisasterSchema)
module.exports=DisasterModel
