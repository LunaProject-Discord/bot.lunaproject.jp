import { AddIcon } from '@/components/icons';
import {
    changeClasses,
    ChangeCode,
    ChangeGroupProps,
    ChangeGroupRoot,
    ChangeIconRoot,
    ChangeIconSpacer,
    ChangeRoot,
    ChangeUndoButton
} from '@/components/save_confirm_v2/changes/index';
import { LocalizationProps } from '@/interfaces/localization';
import { Box, Tooltip, Typography } from '@mui/material';

export const ChangeAddIcon = ({ localization: { translations } }: LocalizationProps) => (
    <Tooltip title={translations.add}>
        <Box component="span" className={changeClasses.icon} sx={{ display: 'flex' }}>
            <AddIcon fontSize="small" color="action" />
        </Box>
    </Tooltip>
);

export const ChangeAdd = ({ path, changes, localization }: ChangeGroupProps) => {
    const { translations } = localization;

    if (changes.length > 1) {
        return (
            <ChangeGroupRoot>
                <ChangeRoot>
                    <ChangeIconRoot>
                        <ChangeAddIcon localization={localization} />
                        <ChangeUndoButton localization={localization} />
                    </ChangeIconRoot>
                    <Typography>
                        {path}
                    </Typography>
                </ChangeRoot>
                {changes.map((change) => (
                    <ChangeRoot key={change.path}>
                        <ChangeIconRoot>
                            <ChangeIconSpacer />
                            <ChangeUndoButton localization={localization} />
                        </ChangeIconRoot>
                        <Typography>
                            {change.key}
                        </Typography>
                        <ChangeCode>
                            {JSON.stringify(change.value)}
                        </ChangeCode>
                    </ChangeRoot>
                ))}
            </ChangeGroupRoot>
        );
    } else {
        const change = changes[0];

        if (change.type === 'Object') {
            const record: Record<string, any> = change.value;
            return (
                <ChangeGroupRoot>
                    <ChangeRoot>
                        <ChangeIconRoot>
                            <ChangeAddIcon localization={localization} />
                            <ChangeUndoButton localization={localization} />
                        </ChangeIconRoot>
                        <Typography>
                            {change.path}
                        </Typography>
                    </ChangeRoot>
                    {Object.entries(record).map(([key, value]) => (
                        <ChangeRoot key={key}>
                            <ChangeIconRoot>
                                <ChangeIconSpacer />
                                <ChangeUndoButton localization={localization} />
                            </ChangeIconRoot>
                            <Typography>
                                {key}
                            </Typography>
                            <ChangeCode>
                                {JSON.stringify(value)}
                            </ChangeCode>
                        </ChangeRoot>
                    ))}
                </ChangeGroupRoot>
            );
        } else {
            return (
                <ChangeRoot>
                    <ChangeIconRoot>
                        <ChangeAddIcon localization={localization} />
                        <ChangeUndoButton localization={localization} />
                    </ChangeIconRoot>
                    <Typography>
                        {change.path}
                    </Typography>
                    <ChangeCode>
                        {JSON.stringify(change.value)}
                    </ChangeCode>
                </ChangeRoot>
            );
        }
    }
};
