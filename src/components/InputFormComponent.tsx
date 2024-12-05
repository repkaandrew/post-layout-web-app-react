import React from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {ObstructionData, ObstructionType, PostLayoutInput} from '../models/post-layout-input.ts';
import {Controls} from '../types/Types.ts';
import * as yup from "yup"
import {ObjectSchema} from "yup"
import {yupResolver} from '@hookform/resolvers/yup';

interface InputFormProps {
  onSubmit: (value: PostLayoutInput) => void;
}

const CONTROLS: Controls<PostLayoutInput> = {
  postSize: 'postSize',
  panelMaxLength: 'panelMaxLength',
  runHorLength: 'runHorLength',
  obstructions: 'obstructions'
};

const OBSTRUCTION_CONTROLS: Controls<ObstructionData> = {
  size: 'size',
  type: 'type',
  location: 'location'
};

const OBSTRUCTION_OPTIONS: { name: string, value: ObstructionType }[] = [
  {name: 'Try to avoid', value: ObstructionType.TRY_TO_AVOID},
  {name: 'Must avoid', value: ObstructionType.MUST_AVOID},
  {name: 'Place post here', value: ObstructionType.PLACE_POST}
];

const formSchema: ObjectSchema<PostLayoutInput> =
  yup.object({
    [CONTROLS.postSize]: yup.number().positive().required(),
    [CONTROLS.runHorLength]: yup.number().positive().required(),
    [CONTROLS.panelMaxLength]: yup.number().positive().required(),
    [CONTROLS.obstructions]: yup.array().of(
      yup.object({
        [OBSTRUCTION_CONTROLS.size]: yup.number().positive().required(),
        [OBSTRUCTION_CONTROLS.type]: yup.string().oneOf(OBSTRUCTION_OPTIONS.map(option => option.value)).required(),
        [OBSTRUCTION_CONTROLS.location]: yup.number().positive().required()
      }))
  });

const InputFormComponent: React.FC<InputFormProps> = ({onSubmit}) => {
  const {register, control, formState: {isValid, errors}, handleSubmit} = useForm<PostLayoutInput>({
    defaultValues: new PostLayoutInput({obstructions: []}),
    resolver: yupResolver(formSchema),
    mode: 'onBlur'
  });
  const {
    fields: obstructions,
    append: appendObstruction,
    remove: removeObstruction
  } = useFieldArray<PostLayoutInput>({control, name: CONTROLS.obstructions});

  return (
    <div className="form-container">
      <div className="form-input">
        <span className="control-title">
          Post size:
        </span>
        <input
          {...register(CONTROLS.postSize, {valueAsNumber: true})}
          className="form-control default-input"
          type="number"/>
      </div>
      <div className="form-input">
        <span className="control-title">
          Panel max length:
        </span>
        <input
          {...register(CONTROLS.panelMaxLength, {valueAsNumber: true})}
          className="form-control default-input"
          type="number"/>
      </div>
      <div className="form-input">
      <span className="control-title">
        Run horizontal length:
      </span>
        <input
          {...register(CONTROLS.runHorLength, {valueAsNumber: true})}
          className="form-control default-input"
          type="number"/>
      </div>

      <div className="form-group ">
        <div className="obstructions-title__block">
          <span className="control-title">
         Obstructions:
          </span>
          <button className="obstruction-btn"
                  onClick={() => appendObstruction(new ObstructionData())}>
            <span>+</span>
          </button>
        </div>
        {obstructions.map((obstruction, idx) => (
          <div key={obstruction.id} className="obstruction-section">
            <div className="obstruction-group">
              <div className="form-input">
              <span className="control-title">
                Size:
              </span>
                <input
                  {...register(`${CONTROLS.obstructions}.${idx}.${OBSTRUCTION_CONTROLS.size}`)}
                  className="form-control default-input"
                  type="number"/>
              </div>
              <div className="form-input">
                <span className="control-title">Type:</span>
                <select
                  id={`obstruction-type-${idx}`}
                  {...register(`${CONTROLS.obstructions}.${idx}.${OBSTRUCTION_CONTROLS.type}`)}
                  className="default-input">
                  {OBSTRUCTION_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-input">
              <span className="control-title">
                Location:
              </span>
                <input
                  {...register(`${CONTROLS.obstructions}.${idx}.${OBSTRUCTION_CONTROLS.location}`, {valueAsNumber: true})}
                  className="form-control default-input"
                  type="number"/>
              </div>
            </div>
            <button className="obstruction-btn"
                    onClick={() => removeObstruction(idx)}>
              <span>&minus;</span>
            </button>
          </div>
        ))}
      </div>
      <button className="btn btn-light calculate-button"
              disabled={!isValid}
              onClick={handleSubmit(onSubmit)}>
        <span>Calculate</span>
      </button>
    </div>
  );
}

export default InputFormComponent;
