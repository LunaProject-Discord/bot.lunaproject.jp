'use client';

import { borderAndBoxShadow } from '@lunaproject/web-core/dist/utils';
import { Theme } from '@mui/material';
import { DataGrid as MuiDataGrid, DataGridProps, GridToolbar } from '@mui/x-data-grid';

export const DataGrid = (props: DataGridProps) => (
    <MuiDataGrid
        slots={{
            toolbar: GridToolbar
        }}
        slotProps={{
            pagination: {
                slotProps: {
                    select: {
                        MenuProps: {
                            slotProps: {
                                paper: {
                                    sx: (theme: Theme) => borderAndBoxShadow(theme)
                                }
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
