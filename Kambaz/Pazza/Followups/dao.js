import FollowupModel from "./model.js";

export const findFollowupsForPost = async (postId) => {
  return FollowupModel.find({ post: postId }).sort({ createdAt: 1 });
};

export const findFollowupById = async (followupId) => {
  return FollowupModel.findById(followupId);
};

export const createFollowup = async (followup) => {
  return FollowupModel.create(followup);
};

export const updateFollowup = async (followupId, updates) => {
  updates.updatedAt = new Date();
  return FollowupModel.findByIdAndUpdate(followupId, updates, { new: true });
};

export const deleteFollowup = async (followupId) => {
  return FollowupModel.findByIdAndDelete(followupId);
};

export const deleteFollowupsForPost = async (postId) => {
  return FollowupModel.deleteMany({ post: postId });
};
export const toggleResolved = async (followupId) => {
  const followup = await FollowupModel.findById(followupId);
  if (followup) {
    followup.resolved = !followup.resolved;
    followup.updatedAt = new Date();
    await followup.save();
  }
  return followup;
};
export const addReply = async (followupId, reply) => {
  const followup = await FollowupModel.findById(followupId);
  if (followup) {
    followup.replies.push(reply);
    followup.updatedAt = new Date();
    await followup.save();
  }
  return followup;
};
export const updateReply = async (followupId, replyId, updates) => {
  const followup = await FollowupModel.findById(followupId);
  if (followup) {
    const reply = followup.replies.id(replyId);
    if (reply) {
      reply.content = updates.content;
      reply.updatedAt = new Date();
      followup.updatedAt = new Date();
      await followup.save();
    }
  }
  return followup;
};
export const deleteReply = async (followupId, replyId) => {
  const followup = await FollowupModel.findById(followupId);
  if (followup) {
    followup.replies = followup.replies.filter((r) => r._id !== replyId);
    followup.updatedAt = new Date();
    await followup.save();
  }
  return followup;
};
export const countUnresolvedFollowups = async (postIds) => {
  return FollowupModel.countDocuments({
    post: { $in: postIds },
    resolved: false,
  });
};
