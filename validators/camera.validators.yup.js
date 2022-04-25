import * as yup from 'yup';

const createOneSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
});

const getOneSchema = yup.string().length(24);

const createOne = async (req, res, next) => {
  // console.log('- validator createOne req.body -', req.body);

  await createOneSchema.validate(req.body);

  next();
};

const getOne = async (req, res, next) => {
  // console.log('- validator getOne req.params -', req.params);

  await getOneSchema.validate(req.params.id);

  next();
};

export default { getOne, createOne };
