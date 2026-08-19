import { useTranslation } from "react-i18next";
import { IFilter } from "../../../../types/IFilter";

interface BackgroundBlurProps {
    filter: IFilter;
    setFilter: React.Dispatch<React.SetStateAction<IFilter | undefined>>;
}

const BackgroundBlur: React.FC<BackgroundBlurProps> = ({
    filter,
    setFilter,
}) => {
    const { t } = useTranslation();
    const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (
            !filter?.container ||
            !filter.backgroundBlur?.show ||
            !filter.backgroundBlur?.blurFilter
        )
            return;

        const blur = Number(event.target.value);
        filter.backgroundBlur.blurFilter.blur = blur;

        setFilter({
            ...filter,
            backgroundBlur: {
                ...filter.backgroundBlur,
                blur: blur,
            },
        });
    };

    return (
        <div className="option__content">
            <div className="transform-icons">
                <h3>
                    {t("background.filters.background-blur-settings.bluriness")}
                </h3>
            </div>
            <input
                type="range"
                name="bluriness-value"
                id="bluriness-value"
                min={0}
                max={15}
                step={0.1}
                value={filter?.backgroundBlur?.blur}
                onChange={handleBlur}
            />
        </div>
    );
};

export default BackgroundBlur;
