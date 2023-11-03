'use client';

import { borderAndBoxShadow } from '@lunaproject-discord/web-core/dist/utils/theme';
import { DataGrid as MuiDataGrid, DataGridProps, GridToolbar } from '@mui/x-data-grid';

export const DataGrid = (props: DataGridProps) => (
    <MuiDataGrid
        slots={{
            toolbar: GridToolbar
        }}
        slotProps={{
            pagination: {
                SelectProps: {
                    MenuProps: {
                        slotProps: {
                            paper: {
                                sx: (theme) => borderAndBoxShadow(theme)
                            }
                        }
                    }
                }
            },
            toolbar: {
                printOptions: { disableToolbarButton: true },
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 }
            }
        }}
        {...props}
    />
);
