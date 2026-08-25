<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->string('external_id')
                ->nullable()
                ->after('id');

            $table->string('old_price')
                ->nullable()
                ->after('price');

            $table->text('description')
                ->nullable()
                ->after('old_price');

            $table->string('sku')
                ->nullable()
                ->after('description');

            $table->text('url')
                ->nullable()
                ->after('sku');

            $table->json('images')
                ->nullable()
                ->after('url');

            $table->string('source')
                ->nullable()
                ->after('images');

            $table->string('handle')
                ->nullable()
                ->after('source');

            $table->boolean('available')
                ->default(true)
                ->after('handle');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->dropColumn([
                'external_id',
                'old_price',
                'description',
                'sku',
                'url',
                'images',
                'source',
                'handle',
                'available',
            ]);
        });
    }
};
