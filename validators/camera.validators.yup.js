import * as yup from 'yup';

const createOneSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
});

const createOne = async (req, res, next) => {
  // console.log('- validator createOne req.body -', req.body);

  await createOneSchema.validate(req.body);

  next();
};

export default { createOne };
