import css from './index.module.scss'

export const LoaderPageComponent = ({ text = 'Загрузка данных...' }: { text?: string }) => {
  return (
    <div className={css.loaderContainer}>
      <div className={css.spinnerWrapper}>
        <div className={css.spinnerRing} />
        <div className={css.spinnerCore} />
      </div>
      <span className={css.loaderText}>{text}</span>
    </div>
  )
}
